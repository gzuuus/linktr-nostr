export class FormData {
  title: string = "";
  summary: string = "";
  links: { link: string; description: string }[] = [{ link: "", description: "" }];
  labels: { label: string }[] = [{ label: "" }];
  forkData: { forkPubKey: string; forkEventoPointer: string } = { forkPubKey: "", forkEventoPointer: "" };
  hashtags: string[] = [];
}
