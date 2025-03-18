/**
 * Configuration du modèle de données de l'application
 * Ce fichier sert de documentation et de référence pour la structure des données
 */

/**
 * Catégorie d'événements
 */
export interface EventCategory {
  /** Identifiant unique de la catégorie */
  id: string;
  
  /** Nom de la catégorie */
  name: string;
  
  /** Description de la catégorie */
  description: string;
  
  /** Configuration des couleurs pour différents types d'événements */
  colors: {
    /** Couleur par défaut */
    default: string;
    /** Couleurs spécifiques (ex: saturday, sunday pour les weekends) */
    [key: string]: string;
  };
  
  /** Configuration des positions pour différents types d'événements */
  positions: {
    /** Position par défaut */
    default: number;
    /** Positions spécifiques */
    [key: string]: number;
  };
  
  /** Indique si la catégorie est personnalisée (non système) */
  isCustom?: boolean;
  
  /** Ordre d'affichage dans la liste des catégories */
  order: number;
}

/**
 * Événement
 */
export interface Event {
  /** Identifiant unique de l'événement */
  id: string;
  
  /** Nom de l'événement */
  name: string;
  
  /** Date de début (format: YYYY-MM-DD) */
  startDate: string;
  
  /** Date de fin (format: YYYY-MM-DD) */
  endDate: string;
  
  /** Couleur de l'événement */
  color: string;
  
  /** Visibilité de l'événement */
  visible: boolean;
  
  /** Position verticale sur le calendrier (1 = plus proche du centre) */
  position: number;
  
  /** Catégorie de l'événement */
  category: string;
  
  /** Type spécifique d'événement (optionnel) */
  type?: string;
  
  /** Valeur associée à l'événement (2 décimales, peut être négative) */
  value: number;
}

/**
 * Structure du fichier d'import JSON
 */
export interface ImportData {
  /** Configuration de la catégorie */
  category: {
    name: string;
    description: string;
    colors: {
      default: string;
      [key: string]: string;
    };
    positions: {
      default: number;
      [key: string]: string;
    };
  };
  
  /** Liste des événements à importer */
  events: Array<{
    name: string;
    startDate: string;
    endDate: string;
    color: string;
    visible: boolean;
    position: number;
    type?: string;
    value: number;
  }>;
}

/**
 * Configuration des séries système
 */
export const SYSTEM_CATEGORIES = {
  WEEKEND: 'weekend',
  HOLIDAY: 'holiday',
  SCHOOL_HOLIDAY: 'school_holiday',
  RELIGIOUS: 'religious'
} as const;

/**
 * Configuration des couleurs par défaut
 */
export const DEFAULT_COLORS = {
  SATURDAY: '#22C55E',
  SUNDAY: '#6B7280',
  HOLIDAY: '#EF4444',
  SCHOOL_HOLIDAY: '#3B82F6',
  RELIGIOUS: '#9333EA'
} as const;

/**
 * Configuration des positions par défaut
 */
export const DEFAULT_POSITIONS = {
  WEEKEND: 1,
  HOLIDAY: 1,
  SCHOOL_HOLIDAY: 2,
  RELIGIOUS: 3
} as const;