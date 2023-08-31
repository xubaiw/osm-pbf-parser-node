/// <reference types="npm:@types/node" />

declare module "osm-pbf-parser-node" {
  import { Transform, TransformOptions } from "node:stream";

  type WithTags = boolean | string[];

  export interface OSMOptions {
    withTags?: boolean | {
      node?: WithTags;
      way?: WithTags;
      relation?: WithTags;
    };
    withInfo?: boolean;
    writeRaw?: boolean;
  }

  export class OSMTransform extends Transform {
    constructor(osmopts?: OSMOptions, opts?: TransformOptions);
  }

  export function createOSMStream(
    file: string,
    opts?: OSMOptions,
  ): AsyncIterable<OSMItem>;

  export type OSMItem = OSMHeaderBlock | OSMNode | OSMWay | OSMRelation;

  export type OSMHeaderBlock = {
    bbox: Record<"left" | "right" | "top" | "bottom", number>;
    required_features: string[];
    optional_features: string[];
    writingprogram: string;
    source: string;
    osmosis_replication_timestamp: number;
    osmosis_replication_sequence_number: number;
    osmosis_replication_base_url: string;
  };

  type OSMObjectShared = {
    id: number;
    tags?: Record<string, string>;
    info?: Record<string, string>;
  };

  export type OSMNode = OSMObjectShared & {
    type: "node";
    lat: number;
    lon: number;
  };

  export type OSMWay = OSMObjectShared & {
    type: "way";
    refs: number[];
  };

  export type OSMRelation = {
    type: "relation";
    members: OSMMember;
  };

  export type OSMMember = {
    type: "node" | "way" | "relation";
    ref: number;
    role: string;
  };

  export function parse(
    osmdata: Buffer,
    transform: OSMTransform | OSMOptions,
  ): Array<any>;
}
