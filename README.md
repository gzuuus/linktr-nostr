# Nostree

![nostree-banner](https://image.nostr.build/cf78fa7b9a80ee8845d967324da64736d12704590fcbe3c9f7142444ddce4cf9.jpg)

> Nostree is a link tree style nostr client, it allows you to create and manage lists of links that you can share with anyone. You can create as many lists as you like and they will be displayed in your profile. You can also edit or delete the lists.

## Motivation

[nostr](https://github.com/nostr-protocol/) its an open protocol under a public domain licence, which ensures its openness, the protocol aims to be decentralised, uncensorable, sovereign and very portable, these values resonate in the mind of every person seeking freedom in this world that its becoming more and more unfree. Nostree porsuis these values as well, and its the main focus and motivation behind this project, its free to use, data its owned by you and the relays of the network, and signed by yourself, you can use it with whatever nostr key and no more, no emails, phone numbers, personal data, etc.

## Filosophy

Nostree is an open source client, the actual licence is GPL-3 which ensures the project will remain open source, but the intention is to make it as open as possible without compromising it's open source esence, the project is open to a licence change if the community requires it.

As this project was founded by [openSats](https://opensats.org/), PRs and collaboration is encouraged and they will be eligible to receive bounties, please feel free to open PRs or issues.

## Roadmap

This roadmap is only a draft of the direction of the project, it can be changed, modified and expanded, if you have more ideas, please consider adding an issue or PR presenting them.

- [x] List creation
- [x] List output
- [x] Delete list
- [x] List forking
- [x] List unique identifiers
- [x] List slugs (for shorter and more memorable urls)
- [x] Hashtags
- [x] Simple share button
- [x] Migration to TailwindCSS
- [x] Theming system with ability to set themes for users
- [x] Cache system
- [ ] Theme generator
- [ ] Docs
- [ ] Edit profile
- [ ] Follow button
- [ ] On boarding
- [ ] Calendar events
- [ ] Live streaming events
- [ ] Offline lists
- [ ] Nip-15 market/stall integration
- [ ] Autoplay music/media lists
- [ ] Expanded personal pages, with more stuff (articles, notes, etc)

### Case study

#### Event format:

```json

{
    ...
    "kind": 30003,
    "content": "",
    "tags": [
        ["d", "nostree-{uuidv4}"],
        ["title", "Link Title"],
        ["description", "List description"],
        ["L", "me.nostree.ontology"]
        ["image", "https://nostr.build/i/518262ea28232ace1eee250038d7657d70a0a186bb05f73c7a715e948c499a3a.jpg"],
        ["r", "https://link1.com", "link1"],
        ["r", "mailto:email@example.com", "link2"],
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

### List of valid prefixes

```json
    "http://",
    "https://",
    "ftp://",
    "nostr:",
    "mailto:",
    "tel:",
    "file://",
    "data:",
    "ssh://",
    "irc://",
    "magnet:",
```
