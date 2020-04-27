export type KV = { [key: string]: any };

export interface Stream {
    topic: string,
    partition: number,
};

export interface Metadata {
    type: string,
    key: string,
    timestamp: string,
}

export interface Event {
    metadata: Metadata,
    params: KV,
}

export type EventCallback = (event: Event) => void;
