import React, { useEffect, useState, useRef } from "react";
import { Avatar, Badge, Dropdown, List, App } from "antd";
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import { supabaseClient } from "../../utility/supabaseClient";
import { MessageChat } from "../../types/message";
import "../../styles/notificationBell.css";
import {
  fetchNotificationHistory,
  fetchClaimChannels,
  setupNotificationChannel,
} from "../../services/notification/notificationApi";
import { fetchUserById } from "../../services/customer/customerApi";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

interface NotificationBellProps {
  mode: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ mode }) => {
  const [notifications, setNotifications] = useState<MessageChat[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase_url_storage_images = import.meta.env
    .VITE_SUPABASE_STORAGE_URL_FOR_IMAGES;
  const [senders, setSenders] = useState<{ [key: string]: any }>({});
  const [claimChannels, setClaimChannels] = useState<number[]>([]);
  const adminId = import.meta.env.VITE_CURRENT_USER_ID;
  const { message } = App.useApp();
  const navigate = useNavigate();

  // Ajouter une ref pour stocker le canal
  const channelRef = useRef<RealtimeChannel | null>(null);
  // Ajouter une ref pour éviter les initialisations multiples
  const isInitializedRef = useRef(false);
  // Ajouter une ref pour stocker le nom du canal actuel
  const currentChannelNameRef = useRef<string | null>(null);

  useEffect(() => {
    console.log("🔍 useEffect - Initialisation des notifications");

    // Éviter les initialisations multiples
    if (isInitializedRef.current) {
      console.log("🔍 Initialisation déjà en cours, ignoré");
      return;
    }

    isInitializedRef.current = true;

    const initializeNotifications = async () => {
      try {
        // Nettoyer l'ancien canal s'il existe
        if (channelRef.current) {
          console.log("🔍 Nettoyage de l'ancien canal de notification");
          supabaseClient.removeChannel(channelRef.current);
          channelRef.current = null;
        }

        console.log("🔍 Chargement de l'historique des notifications");
        const history = await fetchNotificationHistory();
        console.log("🔍 Historique des notifications chargé:", history);
        setNotifications(history);

        // Charger les informations des expéditeurs
        console.log("🔍 Chargement des informations des expéditeurs");
        const senderIds = [...new Set(history.map((msg) => msg.sender_id))];
        const sendersData: { [key: string]: any } = {};

        for (const senderId of senderIds) {
          try {
            const sender = await fetchUserById(senderId);
            if (sender) {
              sendersData[senderId] = sender;
            }
          } catch (error) {
            console.error(
              `Erreur lors du chargement de l'expéditeur ${senderId}:`,
              error,
            );
          }
        }

        console.log("🔍 Expéditeurs chargés:", sendersData);
        setSenders(sendersData);

        console.log("🔍 Récupération des canaux de réclamation");
        const channelIds = await fetchClaimChannels();
        console.log("🔍 Canaux de réclamation récupérés: ", channelIds);
        setClaimChannels(channelIds);

        // Vérifier si un canal avec le même nom existe déjà
        const channelName = `message_notifications_${adminId}_${Date.now()}`;
        
        // Vérifier si on a déjà un canal actif avec ce nom
        if (currentChannelNameRef.current === channelName) {
          console.log("🔍 Canal déjà existant, ignoré:", channelName);
          return;
        }
        
        console.log("🔍 Création du canal:", channelName);
        
        // Créer le canal directement avec Supabase (comme dans le chat qui fonctionne)
        const channel = supabaseClient
          .channel(channelName)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "message_chat",
              filter: channelIds.length > 0 ? `channel_id=in.(${channelIds.join(",")})` : undefined,
            },
            async (payload) => {
              console.log("🔔 Nouveau message reçu dans les notifications:", payload);
              const newMessage = payload.new as MessageChat;
              
              // Vérifier que le message n'est pas de l'admin actuel
              if (newMessage.sender_id === adminId) {
                console.log("🔔 Message ignoré (envoyé par l'admin actuel)");
                return;
              }

              const sender = await fetchUserById(newMessage.sender_id);

              setNotifications((prev) => [newMessage, ...prev]);
              setUnreadCount((prev) => prev + 1);

              // Mettre à jour les expéditeurs avec le nouvel expéditeur
              if (sender) {
                setSenders((prev) => ({
                  ...prev,
                  [newMessage.sender_id]: sender,
                }));
              }

              message.warning({
                content: `Nouveau message de ${sender?.first_name || 'Utilisateur'} ${sender?.last_name || ''} : ${newMessage.message}`,
                duration: 5,
                style: {
                  fontSize: "18px",
                  marginTop: "50px",
                },
              });
            },
          )
          .subscribe((status) => {
            console.log("🔔 Statut du canal de notification:", status, "pour", channelName);
            
            if (status === "SUBSCRIBED") {
              console.log("✅ Canal de notification connecté:", channelName);
            }
            
            if (status === "CHANNEL_ERROR") {
              console.error("❌ Erreur de connexion au canal de notification:", channelName);
            }
            
            if (status === "TIMED_OUT") {
              console.error("⏰ Timeout de connexion au canal de notification:", channelName);
            }
            
            if (status === "CLOSED") {
              console.log("🔒 Canal de notification fermé:", channelName);
            }
          });

        // Stocker la référence du canal et son nom
        channelRef.current = channel;
        currentChannelNameRef.current = channelName;
        console.log("🔍 Canal de notification créé avec succès");
        
        // Test de connexion après 2 secondes
        setTimeout(() => {
          const channels = supabaseClient.getChannels();
          console.log(
            "🔍 Canaux actifs:",
            channels.map((ch) => ({
              topic: ch.topic,
              state: ch.state,
            })),
          );
        }, 2000);
      } catch (error) {
        console.error(
          "Erreur lors de l'initialisation des notifications:",
          error,
        );
        // Réinitialiser le flag en cas d'erreur
        isInitializedRef.current = false;
      }
    };

    initializeNotifications();

    // Fonction de nettoyage
    return () => {
      if (channelRef.current) {
        console.log(
          "🔍 Suppression du canal de notification lors du démontage",
        );
        try {
          supabaseClient.removeChannel(channelRef.current);
        } catch (error) {
          console.error("Erreur lors de la suppression du canal:", error);
        }
        channelRef.current = null;
        currentChannelNameRef.current = null;
      }
      // Réinitialiser le flag lors du démontage
      isInitializedRef.current = false;
    };
  }, []); // Dépendances vides pour éviter les re-souscriptions

  // Filtrer les notifications pour n'afficher que celles des réclamations
  const filteredNotifications = notifications.filter((notification) =>
    claimChannels.includes(notification.channel_id),
  );

  // Fonction pour naviguer vers le chat de réclamation
  const handleNotificationItemClick = async (notification: MessageChat) => {
    try {
      // Récupérer les informations de la réclamation basées sur le channel_id
      const { data: claimData, error } = await supabaseClient
        .from("claim")
        .select("claim_id, claim_slug, order_id")
        .eq("channel_id", notification.channel_id)
        .eq("is_active", true)
        .single();

      if (error) {
        console.error(
          "Erreur lors de la récupération de la réclamation:",
          error,
        );
        message.error("Impossible de naviguer vers la réclamation");
        return;
      }

      if (claimData) {
        // Naviguer vers la page de réclamation avec l'ID
        navigate(`/claim/${claimData.claim_id}`);
        setUnreadCount(0);
      } else {
        message.warning("Réclamation non trouvée ou inactive");
      }
    } catch (error) {
      console.error("Erreur lors de la navigation:", error);
      message.error("Erreur lors de la navigation");
    }
  };

  const handleNotificationClick = () => {
    console.log(
      "🔍 Notification cliquée, réinitialisation du compteur de non-lus",
    );
    setUnreadCount(0);
  };

  const getThemeColors = () => ({
    backgroundColor: mode === "dark" ? "#1f1f1f" : "white",
    textColor: mode === "dark" ? "#ffffff" : "#1f1f1f",
    borderColor: mode === "dark" ? "#303030" : "#e0e0e0",
    secondaryTextColor: mode === "dark" ? "#a0a0a0" : "gray",
  });

  const colors = getThemeColors();

  const renderAvatar = (avatarUrl: string | undefined) => {
    if (!avatarUrl) {
      return <Avatar icon={<UserOutlined />} />;
    }
    return (
      <Avatar
        src={avatarUrl}
        onError={() => {
          return true;
        }}
      />
    );
  };

  const notificationList = (
    <List
      style={{
        width: 300,
        maxHeight: 400,
        overflow: "auto",
        backgroundColor: colors.backgroundColor,
        borderRadius: "10px",
        boxShadow:
          mode === "dark"
            ? "0 2px 8px rgba(255,255,255,0.1)"
            : "0 2px 8px rgba(0,0,0,0.1)",
      }}
      dataSource={filteredNotifications}
      renderItem={(item) => (
        <List.Item
          style={{
            border: `1px solid ${colors.borderColor}`,
            borderRadius: "10px",
            marginBottom: "1px",
            backgroundColor: colors.backgroundColor,
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onClick={() => handleNotificationItemClick(item)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = mode === "dark" ? "#2a2a2a" : "#f5f5f5";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.backgroundColor;
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "12px",
              color: colors.secondaryTextColor,
              marginLeft: "20px",
            }}
          >
            <Avatar
              src={
                senders[item.sender_id]?.avatar
                  ? `${supabase_url_storage_images}/${senders[item.sender_id].avatar}`
                  : undefined
              }
              icon={!senders[item.sender_id]?.avatar ? <UserOutlined /> : undefined}
              style={{ marginRight: "10px" }}
            />

            <div
              style={{
                marginLeft: "40px",
                color: colors.textColor,
              }}
            >
              <div style={{ color: colors.textColor }}>
                {senders[item.sender_id]
                  ? `${senders[item.sender_id].first_name} ${senders[item.sender_id].last_name}`
                  : "Utilisateur inconnu"}
              </div>
              <p style={{ color: colors.secondaryTextColor }}>{item.message}</p>
              <p style={{ color: colors.secondaryTextColor, fontSize: "11px" }}>
                {getTimeDifference(item.created_at)}
              </p>
            </div>
          </div>
        </List.Item>
      )}
    />
  );

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "1",
            label: notificationList,
          },
        ],
      }}
      trigger={["click"]}
      onOpenChange={handleNotificationClick}
    >
      <Badge count={unreadCount} style={{ cursor: "pointer" }}>
        <BellOutlined
          style={{
            fontSize: "20px",
            color: mode === "dark" ? "#fff" : "#1f1f1f",
          }}
        />
      </Badge>
    </Dropdown>
  );
};

const getTimeDifference = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `il y a ${days} jour${days > 1 ? "s" : ""}`;
  if (hours > 0) return `il y a ${hours} heure${hours > 1 ? "s" : ""}`;
  if (minutes > 0) return `il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
  return "à l'instant";
};

export default NotificationBell;
