import type { PageLoad } from "./$types";

export const load = (async ({ params }) => {
  return {
    listAddr: params.linkAddr,
  };
}) satisfies PageLoad;
