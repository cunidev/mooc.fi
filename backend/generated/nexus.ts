/**
 * This file was automatically generated by Nexus 0.11.6
 * Do not make changes to this file directly
 */




declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
}

export interface NexusGenRootTypes {
  Completion: { // root type
    completion_language: string; // String!
    email: string; // String!
    first_name: string; // String!
    id: number; // Int!
    last_name: string; // String!
    student_number: string; // String!
    username: string; // String!
  }
  Query: {};
  User: { // root type
    administrator: boolean; // Boolean!
    completed_enough: boolean; // Boolean!
    createdAt: any; // DateTime!
    email: string; // String!
    first_name?: string | null; // String
    id: string; // ID!
    last_name?: string | null; // String
    updatedAt: any; // DateTime!
    upstream_id: number; // Int!
  }
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
  DateTime: any;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
}

export interface NexusGenFieldTypes {
  Completion: { // field return type
    completion_language: string; // String!
    email: string; // String!
    first_name: string; // String!
    id: number; // Int!
    last_name: string; // String!
    student_number: string; // String!
    username: string; // String!
  }
  Query: { // field return type
    completions: NexusGenRootTypes['Completion'][]; // [Completion!]!
    currentUser: NexusGenRootTypes['User']; // User!
    users: NexusGenRootTypes['User'][]; // [User!]!
  }
  User: { // field return type
    administrator: boolean; // Boolean!
    completed_enough: boolean; // Boolean!
    createdAt: any; // DateTime!
    email: string; // String!
    first_name: string | null; // String
    id: string; // ID!
    last_name: string | null; // String
    updatedAt: any; // DateTime!
    upstream_id: number; // Int!
  }
}

export interface NexusGenArgTypes {
  Query: {
    currentUser: { // args
      email?: string | null; // String
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "Completion" | "Query" | "User";

export type NexusGenInputNames = never;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "DateTime" | "Float" | "ID" | "Int" | "String";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}