/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    mutation restoreAccessToken {\n        restoreAccessToken {\n            accessToken\n        }\n    }\n": typeof types.RestoreAccessTokenDocument,
    "\n    mutation login($loginInput: LoginInput!) {\n        login(loginInput: $loginInput) {\n            accessToken\n            refreshToken\n        }\n    }\n": typeof types.LoginDocument,
    "\n    mutation signup($signupInput: SignupInput!) {\n        signup(signupInput: $signupInput) {\n            id\n            email\n            name\n        }\n    }\n": typeof types.SignupDocument,
    "\n    mutation uploadFile($file: Upload) {\n        uploadFile(file: $file) {\n            url\n        }\n    }\n": typeof types.UploadFileDocument,
    "\n    query fetchSolplaceLog($id: ID!) {\n        fetchSolplaceLog(id: $id) {\n            id\n            title\n            contents\n            address\n            lat\n            lng\n            images\n            userId\n        }\n    }\n": typeof types.FetchSolplaceLogDocument,
    "\n    mutation updateSolplaceLog($id: ID!, $updateSolplaceLogInput: UpdateSolplaceLogInput!) {\n        updateSolplaceLog(id: $id, updateSolplaceLogInput: $updateSolplaceLogInput) {\n            id\n            title\n            contents\n            address\n            lat\n            lng\n            images\n            addressCity\n            addressTown\n        }\n    }\n": typeof types.UpdateSolplaceLogDocument,
    "\n    query fetchSolplaceLogs($page: Int) {\n        fetchSolplaceLogs(page: $page) {\n            id\n            title\n            contents\n            address\n            # addressCity\n            # addressTown\n            images\n        }\n    }\n": typeof types.FetchSolplaceLogsDocument,
    "\n    mutation createSolplaceLog($createSolplaceLogInput: CreateSolplaceLogInput!) {\n        createSolplaceLog(createSolplaceLogInput: $createSolplaceLogInput) {\n            id\n            title\n            contents\n            address\n            lat\n            lng\n            addressCity\n            addressTown\n            images\n        }\n    }\n": typeof types.CreateSolplaceLogDocument,
};
const documents: Documents = {
    "\n    mutation restoreAccessToken {\n        restoreAccessToken {\n            accessToken\n        }\n    }\n": types.RestoreAccessTokenDocument,
    "\n    mutation login($loginInput: LoginInput!) {\n        login(loginInput: $loginInput) {\n            accessToken\n            refreshToken\n        }\n    }\n": types.LoginDocument,
    "\n    mutation signup($signupInput: SignupInput!) {\n        signup(signupInput: $signupInput) {\n            id\n            email\n            name\n        }\n    }\n": types.SignupDocument,
    "\n    mutation uploadFile($file: Upload) {\n        uploadFile(file: $file) {\n            url\n        }\n    }\n": types.UploadFileDocument,
    "\n    query fetchSolplaceLog($id: ID!) {\n        fetchSolplaceLog(id: $id) {\n            id\n            title\n            contents\n            address\n            lat\n            lng\n            images\n            userId\n        }\n    }\n": types.FetchSolplaceLogDocument,
    "\n    mutation updateSolplaceLog($id: ID!, $updateSolplaceLogInput: UpdateSolplaceLogInput!) {\n        updateSolplaceLog(id: $id, updateSolplaceLogInput: $updateSolplaceLogInput) {\n            id\n            title\n            contents\n            address\n            lat\n            lng\n            images\n            addressCity\n            addressTown\n        }\n    }\n": types.UpdateSolplaceLogDocument,
    "\n    query fetchSolplaceLogs($page: Int) {\n        fetchSolplaceLogs(page: $page) {\n            id\n            title\n            contents\n            address\n            # addressCity\n            # addressTown\n            images\n        }\n    }\n": types.FetchSolplaceLogsDocument,
    "\n    mutation createSolplaceLog($createSolplaceLogInput: CreateSolplaceLogInput!) {\n        createSolplaceLog(createSolplaceLogInput: $createSolplaceLogInput) {\n            id\n            title\n            contents\n            address\n            lat\n            lng\n            addressCity\n            addressTown\n            images\n        }\n    }\n": types.CreateSolplaceLogDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation restoreAccessToken {\n        restoreAccessToken {\n            accessToken\n        }\n    }\n"): (typeof documents)["\n    mutation restoreAccessToken {\n        restoreAccessToken {\n            accessToken\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation login($loginInput: LoginInput!) {\n        login(loginInput: $loginInput) {\n            accessToken\n            refreshToken\n        }\n    }\n"): (typeof documents)["\n    mutation login($loginInput: LoginInput!) {\n        login(loginInput: $loginInput) {\n            accessToken\n            refreshToken\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation signup($signupInput: SignupInput!) {\n        signup(signupInput: $signupInput) {\n            id\n            email\n            name\n        }\n    }\n"): (typeof documents)["\n    mutation signup($signupInput: SignupInput!) {\n        signup(signupInput: $signupInput) {\n            id\n            email\n            name\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation uploadFile($file: Upload) {\n        uploadFile(file: $file) {\n            url\n        }\n    }\n"): (typeof documents)["\n    mutation uploadFile($file: Upload) {\n        uploadFile(file: $file) {\n            url\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query fetchSolplaceLog($id: ID!) {\n        fetchSolplaceLog(id: $id) {\n            id\n            title\n            contents\n            address\n            lat\n            lng\n            images\n            userId\n        }\n    }\n"): (typeof documents)["\n    query fetchSolplaceLog($id: ID!) {\n        fetchSolplaceLog(id: $id) {\n            id\n            title\n            contents\n            address\n            lat\n            lng\n            images\n            userId\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation updateSolplaceLog($id: ID!, $updateSolplaceLogInput: UpdateSolplaceLogInput!) {\n        updateSolplaceLog(id: $id, updateSolplaceLogInput: $updateSolplaceLogInput) {\n            id\n            title\n            contents\n            address\n            lat\n            lng\n            images\n            addressCity\n            addressTown\n        }\n    }\n"): (typeof documents)["\n    mutation updateSolplaceLog($id: ID!, $updateSolplaceLogInput: UpdateSolplaceLogInput!) {\n        updateSolplaceLog(id: $id, updateSolplaceLogInput: $updateSolplaceLogInput) {\n            id\n            title\n            contents\n            address\n            lat\n            lng\n            images\n            addressCity\n            addressTown\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query fetchSolplaceLogs($page: Int) {\n        fetchSolplaceLogs(page: $page) {\n            id\n            title\n            contents\n            address\n            # addressCity\n            # addressTown\n            images\n        }\n    }\n"): (typeof documents)["\n    query fetchSolplaceLogs($page: Int) {\n        fetchSolplaceLogs(page: $page) {\n            id\n            title\n            contents\n            address\n            # addressCity\n            # addressTown\n            images\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createSolplaceLog($createSolplaceLogInput: CreateSolplaceLogInput!) {\n        createSolplaceLog(createSolplaceLogInput: $createSolplaceLogInput) {\n            id\n            title\n            contents\n            address\n            lat\n            lng\n            addressCity\n            addressTown\n            images\n        }\n    }\n"): (typeof documents)["\n    mutation createSolplaceLog($createSolplaceLogInput: CreateSolplaceLogInput!) {\n        createSolplaceLog(createSolplaceLogInput: $createSolplaceLogInput) {\n            id\n            title\n            contents\n            address\n            lat\n            lng\n            addressCity\n            addressTown\n            images\n        }\n    }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;