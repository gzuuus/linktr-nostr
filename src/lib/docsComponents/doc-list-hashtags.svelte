<script lang="ts">
  import { page } from "$app/stores";
</script>

<div class="space-y-8">
  <div class="space-y-4">
    <div>
      <h2 class="text-2xl md:text-3xl font-semibold mb-4">Hashtags</h2>
      <p class="text-lg">Hashtags are a way to categorize your lists to increase discoverability.<br>
        Add relevant tags to help others find your content in the Explore section.</p>
    </div>
    
    <div class="pl-4 space-y-6">
      <div>
        <h4 class="font-semibold mb-2">Hashtag Formats</h4>
        <ul class="space-y-2 pl-4">
          <li><span class="font-medium">Single Word</span> - Like <code>music</code>, <code>films</code>, <code>tech</code></li>
          <li><span class="font-medium">Combined Words</span> - Using <code>-</code> or <code>_</code> like <code>cool-projects</code></li>
          <li><span class="font-medium">Optional</span> - You can leave hashtags blank if desired</li>
        </ul>
      </div>

      <div>
        <h4 class="font-semibold mb-2">Using Hashtags</h4>
        <ul class="space-y-2 pl-4">
          <li><span class="font-medium">Explore</span> - Find lists at <a href="{$page.url.origin}/explore/music" class="text-primary-500" target="_blank" rel="noopener noreferrer">{$page.url.origin}/explore/music</a></li>
          <li><span class="font-medium">Multiple Tags</span> - Add as many tags as needed</li>
          <li><span class="font-medium">Edit Anytime</span> - Update tags whenever you want</li>
        </ul>
      </div>

      <div>
        <h4 class="font-semibold mb-2">Tips</h4>
        <ul class="space-y-2 pl-4">
          <li><span class="font-medium">Be Descriptive</span> - Use clear, relevant tags</li>
          <li><span class="font-medium">Be Consistent</span> - Use similar tags across related lists</li>
          <li><span class="font-medium">Check Explore</span> - See what tags others are using</li>
        </ul>
      </div>
    </div>
  </div>
</div>
