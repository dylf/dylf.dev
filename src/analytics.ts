function analytics() {
  import('@vercel/analytics').then(({ inject }) => {
    inject();
  });
}

export default analytics;
