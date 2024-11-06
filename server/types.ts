export interface LocalVideo {
  id: string;
  fileName: string;
  path: string;
  format: string;
  tmdbId?: number;
  size: number;
}

export interface VideoMetadata extends LocalVideo {
  title: string;
  overview: string;
  posterPath?: string;
  backdropPath?: string;
  releaseDate?: string;
}