<script lang="ts">
  import { page } from "$app/stores";
</script>
<div class="DocsContentContainer">
  <h2>Lists with same Slug</h2>
  <h3>Slugs are a memorable way to identify your nostree lists.</h3>
  <hr />
  <p>Multiple lists can have the same slug, so they will be grouped together on the page for that slug.</p>
  <p>
    For example, <code
      ><a href="{$page.url.origin}/gzuuus/nostr" target="_blank" rel="noopener noreferrer"
        >{$page.url.origin}/gzuuus/nostr</a
      ></code
    > will show you all the lists belonging to the profile @gzuuus that contain the slug nostr.
  </p>
  <p>
    Also for music 🎵 <code
      ><a href="{$page.url.origin}/gzuuus/music" target="_blank" rel="noopener noreferrer"
        >{$page.url.origin}/gzuuus/music</a
      ></code
    >
  </p>
  <p>
    On the other hand, you can write your own to have a memorable way to share your nostree list. <br />For example:
    <code
      ><a href="{$page.url.origin}/gzuuus/nostr" target="_blank" rel="noopener noreferrer"
        >{$page.url.origin}/gzuuus/projects</a
      ></code
    >
  </p>
  <p>Suggested formats for slugs:</p>
  <ul>
    <li>1 word: <code>ex. 'projects'</code></li>
    <li>Words separated by '-', '_': <code>ex. 'cool-projects'</code></li>
  </ul>
  <p>💡You can modify this slug at any moment.</p>
</div>
