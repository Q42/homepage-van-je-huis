import { BaseDataEntity, ImageRef, BaseSliderEntry, BaseView } from "./shared";

export interface PastData extends BaseView {
  timeline: TimelineEntry[]; // The timeline itself
  stories: Story[]; // The stories
}

interface TimelineEntry extends BaseSliderEntry {
  image: ImageRef;
  visitUrl?: string; // URL to the source where people can find out more info about the image
}

interface Story extends BaseDataEntity {
  image?: ImageRef; // URL to the hero image for the story
  title: string; // Title of the story
  contents: string; // Contents of the story
  visitUrl?: string; // URL to the source where people can find out more info about the story
  visitUrlText?: string; // Text to display for the visitUrl. If none is provided, the frontend should default to the default copy/
}
