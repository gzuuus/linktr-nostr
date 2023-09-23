<script lang="ts">
  import { page } from "$app/stores";
</script>
<div class="DocsContentContainer">
  <h2>Hashtags</h2>
  <h3>Hashtags are a way to categorize your nostree list in order to increase discoverability.</h3>
  <hr />
  <p>Hashtags are not an obligatory field; you can leave it blank.</p>
  <p>
    On the other hand, you can add as many hashtags as you want; They allow people to find your list along with others with the same hashtag in the Explore section. <br />For example:
    <code
      ><a href="{$page.url.origin}/explore/music" target="_blank" rel="noopener noreferrer"
        >{$page.url.origin}/explore/music</a
      ></code
    >
  </p>
  <p>Suggested formats for hashtags:</p>
  <ul>
    <li>1 word: <code>e.g., 'music', 'films', etc.</code></li>
    <li>Words separated by '-', '_': <code>e.g., 'cool-projects'</code></li>
  </ul>
  <p>💡You can modify these hashtags at any moment.</p>
  <p>💡If you use the same hashtag for two different lists, both lists will appear on the explore page.</p>
</div>
