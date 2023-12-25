export interface Link {
  url: string,
  description: string
}
export class FormData {
  title: string = "";
  description: string = "";
  links: Link[] = [{ url: "", description: "" }];
  labels: { label: string }[] = [{ label: "" }];
  nameSpace: string = "";
  forkData: { forkPubKey: string; forkEventoPointer: string } = { forkPubKey: "", forkEventoPointer: "" };
  hashtags: string[] = [];
}
