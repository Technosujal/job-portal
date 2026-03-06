import { useState } from "react";
import { useNotifications, useMarkRead, useMarkAllRead } from "@/hooks/use-features.js";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

const typeStyles = {
  application_status: "bg-blue-500/10 text-blue-500",
  interview_scheduled: "bg-violet-500/10 text-violet-500",
  new_applicant: "bg-emerald-500/10 text-emerald-500",
  general: "bg-primary/10 text-primary",
};

const typeIcons = {
  application_status: "📋",
  interview_scheduled: "📅",
  new_applicant: "👤",
  general: "🔔",
};

export function NotificationsBell() {
  const { data: notifications = [] } = useNotifications();
  const { mutate: markRead } = useMarkRead();
  const { mutate: markAllRead } = useMarkAllRead();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center"
              >
                <span className="text-[9px] font-black text-primary-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-3xl overflow-hidden"
        align="end"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <h3 className="font-black text-sm tracking-tight">Notifications</h3>
            <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllRead()}
              className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-white/5">
          {notifications.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground text-sm font-medium">
              <Bell className="h-8 w-8 mx-auto mb-3 opacity-20" />
              No notifications yet
            </div>
          ) : (
            notifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex gap-3 px-5 py-4 cursor-pointer hover:bg-white/5 transition-colors ${
                  !notif.read ? "bg-primary/3" : ""
                }`}
                onClick={() => {
                  if (!notif.read) markRead(notif.id);
                  if (notif.link) {
                    window.location.href = notif.link;
                    setOpen(false);
                  }
                }}
              >
                <div className={`h-9 w-9 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 ${typeStyles[notif.type] || typeStyles.general}`}>
                  {typeIcons[notif.type] || "🔔"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-bold leading-tight ${!notif.read ? "text-foreground" : "text-muted-foreground"}`}>
                      {notif.title}
                    </p>
                    {!notif.read && (
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                    {notif.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground/50 mt-1 font-medium">
                    {formatDistanceToNow(new Date(notif.createdAt * 1000 || notif.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
