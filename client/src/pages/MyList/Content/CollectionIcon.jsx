import { Clock, Heart, Flame, Star, ThumbsUp, Ticket, Video } from "lucide-react";

const ICON_MAP = {
  clock:  Clock,
  heart:  Heart,
  flame:  Flame,
  star:   Star,
  thumbs: ThumbsUp,
  ticket: Ticket,
  video:  Video,
};

export default function CollectionIcon({ iconKey, size = 15 }) {
  const Icon = ICON_MAP[iconKey] ?? Heart;
  return <Icon size={size} />;
}
