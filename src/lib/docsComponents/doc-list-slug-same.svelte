<script lang="ts">
  import { page } from "$app/stores";
</script>

<div class="space-y-8">
  <div class="space-y-4">
    <div>
      <h2 class="text-2xl md:text-3xl font-semibold mb-4">Lists with Same Slug</h2>
      <p class="text-lg">Sometimes different lists might share the same custom URL (slug).<br>
        Here's how to manage and differentiate between them effectively.</p>
    </div>
    
    <div class="pl-4 space-y-6">
      <div>
        <h4 class="font-semibold mb-2">Understanding Slugs</h4>
        <ul class="space-y-2 pl-4">
          <li><span class="font-medium">Not Unique</span> - Multiple lists can have the same slug</li>
          <li><span class="font-medium">All Visible</span> - You'll see all lists with matching slugs</li>
          <li><span class="font-medium">Easy to Share</span> - Simple, memorable URLs for sharing</li>
        </ul>
      </div>

      <div>
        <h4 class="font-semibold mb-2">Managing Multiple Lists</h4>
        <ul class="space-y-2 pl-4">
          <li><span class="font-medium">Unique IDs</span> - Each list has its own identifier</li>
          <li><span class="font-medium">Author Info</span> - See who created each list</li>
          <li><span class="font-medium">Creation Date</span> - Check when lists were made</li>
        </ul>
      </div>

      <div>
        <h4 class="font-semibold mb-2">Best Practices</h4>
        <ul class="space-y-2 pl-4">
          <li><span class="font-medium">Be Specific</span> - Use descriptive, unique slugs</li>
          <li><span class="font-medium">Check First</span> - Search for existing similar slugs</li>
          <li><span class="font-medium">Add Context</span> - Include distinguishing details</li>
        </ul>
      </div>
    </div>
  </div>
</div>
