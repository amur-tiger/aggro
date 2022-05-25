<style global lang="scss">
  $primaryColor: #d32f2f;
  $secondaryColor: #1976d2;

  :root {
    color: #333;
    font-family: "Open Sans", sans-serif;
    --primary-color: #{$primaryColor};
    --primary-color-light: #{lighten($primaryColor, 20%)};
    --primary-color-hover: #{fade-out(lighten($primaryColor, 30%), 0.8)};
    --primary-color-active: #{darken($primaryColor, 10%)};
    --primary-contrast-text: #fff;
    --secondary-color: #{$secondaryColor};
    --secondary-color-light: #{lighten($secondaryColor, 20%)};
    --secondary-color-hover: #{fade-out(lighten($secondaryColor, 30%), 0.8)};
    --secondary-color-active: #{darken($secondaryColor, 10%)};
    --secondary-contrast-text: #fff;
    --disabled-color: #c2c2c2;
    --background-color: #f2f2f2;
    --paper-color: #fff;
    --divider-color: #c2c2c2;
    --error-color: #d32f2f;
  }
</style>
