## Nostree

### nostree.me

Nostree is a linktree style client a la nostr that allows you to create and manage lists of links that you can share with anyone. You can create as many lists as you like and they will be displayed in your profile. You can also edit or even delete the lists.
Nostree also shows your latest notes and articles. The idea is that it becomes a good presentation card for you on nostr. For example:
https://nostree.me/npub1gzuushllat7pet0ccv9yuhygvc8ldeyhrgxuwg744dn5khnpk3gs3ea5ds

### Case study

#### Event format:

```json

{
    ...
    "kind": 30001,
    "content": "",
    "tags": [
        ["d", "nostree-{uuidv4}"],
        ["title", "Link Title"]
        ["image", "https://nostr.build/i/518262ea28232ace1eee250038d7657d70a0a186bb05f73c7a715e948c499a3a.jpg"],
        ["r", "https://github.com/gzuuus", "github"],
        ["r", "https://link2.com/gzuuus", "link2"],
        ["r", "https://link3.net", "link3"],
        ...
        ["t", "Music"],
        ["t", "Personal projects"],
        ["l", "nostree"],
        ...
    ],
    ...
}
```
