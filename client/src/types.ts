// Frontend Types er samlet her

//Brukes i league-service
export type League = {
  id: number;
  name: string;
  country_id: number;
  country_name: string;
  emblem_image_url: string;
  page_id: number;
  content: string;
};

//Brukes i sideHistorikken
export type Page = {
  page_id?: number;
  created_by?: number;
  created_at: Date;
  view_count: number;
};

export type Revisions = {
  revision_id: number;
  content: string;
  revised_by: number;
  revised_at: Date;
  page_id: number;
  username?: string;
};

//Brukes i player-service
export type Player = {
  id: number;
  name: string;
  birth_date: Date;
  height: number;
  country_id: number;
  country_name: string;
  team_name: string;
  team_id: number;
  picture_url: string;
  page_id: number;
  content: string;
  league_id?: number;
  league_name?: string;
};

export type Country = {
  country_name: string;
  flag_image_url: string;
  country_id: number;
};

//Brukes også i team-service
export type Team = {
  name: string;
  id: number;
  country_id: number;
  country_name: string;
  coach: string;
  league_id: number;
  league_name: string;
  emblem_image_url: string;
  page_id: number;
  content: string;
};

//Brukes i comment-service
export type Comment = {
  comment_id: number;
  user_id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
  page_id: number;
  likes: number;
  profile_image_url?: string;
  username?: string;
};

// Brukes i profile-component
export type UserProfile = {
  username: string;
  email: string;
  photo: string;
  firstLogin: string;
  lastLogin: string;
  is_admin: boolean;
  user_id: number;
};

// Brukes i searchBar-component
export type Suggestion = {
  type: string;
  id?: number;
  name: string;
};

// Brukes i API-respons for brukerdata (backend)
export type PublicUser = {
  username: string;
  email: string | null;
  photo: string | null;
  firstLogin: string;
  lastLogin: string;
  is_admin: boolean;
  user_id: number;
};

export type User = {
  user_id: number;
  google_id: string;
  username: string;
  email?: string | null;
  profile_image_url?: string | null;
  first_login: Date;
  last_login: Date;
  last_logout?: Date | null;
  is_admin: boolean;
};

export type Tag = {
  tag_id: number;
  tag_name: string;
};
