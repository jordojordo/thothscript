<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div class="container">
    <nav class="nav">
      <header>
        <img src="@/assets/thoth.png" alt="ThothScript logo" />
        <h1>ThothScript</h1>
      </header>
      <div class="links">
        <RouterLink to="/chat" class="nav-link">Run Script</RouterLink>
        <RouterLink to="/config" class="nav-link">Settings</RouterLink>
      </div>
    </nav>
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: 'nav content';
}

.nav {
  grid-area: nav;
  grid-column: 1 / 2;
  grid-row: 1;
  position: fixed;
  background-color: var(--background-secondary);
  color: var(--foreground-primary);
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  overflow-y: auto;
  top: 0;
  bottom: 0;
  width: 220px;
}

header {
  color: var(--foreground-primary);
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  width: 100%;
  justify-content: center;
}

header img {
  width: 32px;
  height: 32px;
  margin-right: 1rem;
}

.links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
}

.nav-link {
  color: var(--foreground-primary);
  text-decoration: none;
  margin-bottom: 1rem;
  padding: 1rem 1rem;
  width: auto;
}

.nav-link:hover {
  text-decoration: underline;
}

.content {
  grid-area: content;
  background-color: var(--background-primary);
  color: var(--foreground-primary);
  position: relative;
}

@media (max-width: 1075px) {
  .container {
    grid-template-columns: 180px 1fr;
  }

  .nav {
    width: 180px;
  }

  h1 {
    font-size: 1rem;
  }

  img {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 725px) {
  .container {
    display: flex;
    flex-direction: column;
    position: relative;
    height: auto; /* Ensure the container takes full height */
  }

  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 1.25rem;
    z-index: 99;
    border-bottom: 1px solid var(--foreground-tertiary);
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: .5rem 0;
    display: flex;
  }

  header {
    margin: 0 0 0 1rem;
    align-items: center;
    justify-content: flex-start;
  }

  header h1 {
    margin: 0;
  }

  .links {
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: center;
    margin-right: 1rem;
  }

  .nav-link {
    margin: 0;
    padding: 0;
    width: auto;
  }

  .nav-link:nth-child(1) {
    margin-right: 1rem;
  }

  .content {
    width: 100%;
    height: calc(100vh - 2rem); /* Adjust content height to fit within the viewport */
    margin: 0;
    padding: 0;
  }
}
</style>
