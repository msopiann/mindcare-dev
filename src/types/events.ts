export interface EventBanner {
  id: number;
  image: string;
  alt: string;
  link: string;
}

export interface BaseEvent {
  id: number;
  title: string;
  price: number | "free";
  image: string;
  link: string;
  highlighted: boolean;
}

export interface EventCard extends BaseEvent {
  date: string;
  time: string;
  location: string;
  locationIcon: "zoom" | "tba" | "venue";
  category: string;
  availableTickets: boolean;
}

export type RecommendationCard = BaseEvent;

export type LocationIconType = EventCard["locationIcon"];
export type EventPrice = BaseEvent["price"];
