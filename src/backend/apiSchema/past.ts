import { BaseDataEntity } from "./shared";

export type PastData = {
    timeRangeStart: number; // Year at which the timeline starts
    timeRangeEnd: number; // Year at which the timeline ends
    timeline: TimelineEntry[]; // The timeline itself
    stories: Story[]; // The stories
};

interface TimelineEntry extends BaseDataEntity {
    month?: number; // Month of the entry
    year: number; // Year of the entry
    image: string; // URL to the image
    visitUrl?: string; // URL to the source where people can find out more info about the image
    altDescription?: string; // Alt text for the image
}

interface Story extends BaseDataEntity {
    image?: string; // URL to the hero image for the story
    title: string; // Title of the story
    contents: string; // Contents of the story
    visitUrl?: string; // URL to the source where people can find out more info about the story
    visitUrlText?: string; // Text to display for the visitUrl. If none is provided, the frontend should default to the default copy/
}
