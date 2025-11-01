# Gym Activities Carousel Component - Design Specification

## Overview
A responsive carousel component displaying gym activity photos with overlaid titles, positioned below the WobbleCardDemo section on the home page.

## Component Architecture

### 1. Component Structure
```
GymActivitiesCarousel/
├── Component: GymActivitiesCarousel.tsx (Client Component)
├── Location: frontend/src/components/carousel/
├── Dependencies: embla-carousel-react, embla-carousel-autoplay
```

### 2. Visual Design Specifications

#### Layout
- **Container**: Full-width section with max-width constraint
- **Background**: Complementary to WobbleCardDemo section (white or light gray)
- **Padding**: Vertical py-16, horizontal px-4
- **Section Title**: Centered heading above carousel

#### Carousel Configuration
- **Slides per view**:
  - Mobile: 1 slide
  - Tablet: 2 slides
  - Desktop: 3 slides
- **Gap**: 20px between slides
- **Autoplay**: 4-second interval with pause on hover
- **Loop**: Infinite scrolling enabled
- **Controls**: Navigation dots below carousel

#### Individual Slide Design
```
┌─────────────────────────────────┐
│                                 │
│         [Image]                 │
│                                 │
│  ┌─────────────────────────┐   │ ← z-10 overlay
│  │   Título de Actividad   │   │   Semi-transparent bg
│  └─────────────────────────┘   │   Bottom positioning
│                                 │
└─────────────────────────────────┘
```

- **Image**: Aspect ratio 16:9 or 4:3, object-fit cover
- **Overlay Title**:
  - Position: Absolute, bottom 0, z-index 10
  - Background: Semi-transparent gradient (black to transparent)
  - Text: White, font-bold, text-xl md:text-2xl
  - Padding: px-6 py-4

### 3. Data Structure

```typescript
interface GymActivity {
  id: number;
  title: string;
  image: string; // URL or path to image
  alt: string; // Accessibility text
}

const activities: GymActivity[] = [
  {
    id: 1,
    title: "Entrenamiento Funcional",
    image: "/images/activities/functional.jpg",
    alt: "Personas realizando entrenamiento funcional"
  },
  {
    id: 2,
    title: "Musculación",
    image: "/images/activities/weights.jpg",
    alt: "Entrenamiento con pesas"
  },
  {
    id: 3,
    title: "Cardio Intensivo",
    image: "/images/activities/cardio.jpg",
    alt: "Clase de cardio en grupo"
  },
  {
    id: 4,
    title: "Yoga y Estiramiento",
    image: "/images/activities/yoga.jpg",
    alt: "Sesión de yoga en grupo"
  },
  {
    id: 5,
    title: "Spinning",
    image: "/images/activities/spinning.jpg",
    alt: "Clase de spinning indoor"
  },
  {
    id: 6,
    title: "CrossFit",
    image: "/images/activities/crossfit.jpg",
    alt: "Entrenamiento de CrossFit"
  }
];
```

### 4. Technical Implementation Plan

#### Component Features
- ✅ Client-side component ("use client")
- ✅ Embla Carousel with autoplay plugin
- ✅ Responsive breakpoints (mobile, tablet, desktop)
- ✅ Touch/swipe gestures for mobile
- ✅ Keyboard navigation support
- ✅ Accessibility: ARIA labels, alt texts
- ✅ Performance: Image optimization with Next.js Image component

#### Animation & Interactions
- Smooth slide transitions (300ms ease)
- Hover effects on slides (subtle scale transform)
- Pause autoplay on hover
- Active dot indicator styling
- Title overlay with gradient fade-in

#### Styling Approach
- Tailwind CSS for all styling
- Custom CSS for Embla-specific overrides if needed
- Gradient overlay: `bg-gradient-to-t from-black/80 via-black/50 to-transparent`
- Shadow effects for depth: `shadow-lg`

### 5. Integration with Home Page

**Current Structure (page.tsx:19-31)**
```tsx
<section className="w-full bg-gray-50 py-16 px-4">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-12">
      <h2>¿Por Qué Elegirnos?</h2>
      <p>Descubrí los beneficios...</p>
    </div>
    <WobbleCardDemo />
  </div>
</section>
```

**After Integration**
```tsx
<section className="w-full bg-gray-50 py-16 px-4">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-12">
      <h2>¿Por Qué Elegirnos?</h2>
      <p>Descubrí los beneficios...</p>
    </div>
    <WobbleCardDemo />
  </div>
</section>

{/* NEW: Gym Activities Carousel Section */}
<section className="w-full bg-white py-16 px-4">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Nuestras Actividades
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Explorá la variedad de entrenamientos disponibles
      </p>
    </div>
    <GymActivitiesCarousel />
  </div>
</section>
```

### 6. File Organization

```
frontend/
├── src/
│   ├── components/
│   │   ├── carousel/
│   │   │   └── GymActivitiesCarousel.tsx  [NEW]
│   │   └── ui/
│   │       └── WobbleCardDemo.tsx         [EXISTING]
│   └── app/
│       └── page.tsx                        [MODIFY]
└── public/
    └── images/
        └── activities/                     [NEW DIRECTORY]
            ├── functional.jpg
            ├── weights.jpg
            ├── cardio.jpg
            ├── yoga.jpg
            ├── spinning.jpg
            └── crossfit.jpg
```

### 7. Responsive Behavior

| Breakpoint | Slides Visible | Image Height | Title Size |
|------------|----------------|--------------|------------|
| Mobile (<640px) | 1 | 280px | text-xl |
| Tablet (640-1024px) | 2 | 320px | text-xl |
| Desktop (>1024px) | 3 | 360px | text-2xl |

### 8. Accessibility Considerations

- **ARIA Labels**: Carousel role, slide roles, navigation labels
- **Keyboard Navigation**: Arrow keys for slide navigation
- **Focus Management**: Visible focus indicators on interactive elements
- **Alt Text**: Descriptive alt text for all images
- **Color Contrast**: Text overlay ensures WCAG AA compliance (4.5:1 ratio)
- **Screen Reader**: Announce current slide position (e.g., "Slide 1 of 6")

### 9. Performance Optimization

- **Image Loading**: Next.js Image component with lazy loading
- **Priority**: Load first 3 images immediately, lazy load rest
- **Formats**: WebP with JPEG fallback
- **Sizes**: Responsive image sizes for different breakpoints
- **Bundle Size**: Embla carousel is lightweight (~7KB gzipped)

### 10. Future Enhancements (Optional)

- 🔄 Integrate with Strapi CMS for dynamic activity content
- 📱 Add fullscreen lightbox on image click
- 🎬 Support video content alongside images
- 📊 Track carousel engagement analytics
- 🌐 Multi-language support for activity titles
- ⭐ Add activity category filtering

## Implementation Steps

1. ✅ Create component directory: `frontend/src/components/carousel/`
2. ✅ Create `GymActivitiesCarousel.tsx` with Embla carousel setup
3. ✅ Add activity images to `public/images/activities/`
4. ✅ Implement responsive slide configuration
5. ✅ Style overlay titles with z-10 positioning and gradients
6. ✅ Add autoplay and navigation controls
7. ✅ Integrate component into `page.tsx` below WobbleCardDemo
8. ✅ Test responsive behavior across breakpoints
9. ✅ Verify accessibility with screen readers and keyboard navigation
10. ✅ Optimize images and test performance

## Estimated Effort

- **Component Development**: 2-3 hours
- **Image Sourcing/Optimization**: 1 hour
- **Integration & Testing**: 1 hour
- **Total**: 4-5 hours

## Dependencies Already Available

✅ embla-carousel-react: ^8.6.0
✅ embla-carousel-autoplay: ^8.6.0
✅ motion: ^12.23.24 (for additional animations if needed)
✅ Next.js Image optimization
✅ Tailwind CSS for styling

## Design Consistency

This carousel section maintains visual consistency with:
- **WobbleCardDemo**: Similar section structure with title/description header
- **Hero Sections**: Matching typography scale and spacing
- **Color Palette**: Complementary background colors (gray-50 → white alternation)
- **Component Pattern**: Following existing client component patterns

## Notes

- The z-10 overlay ensures titles remain visible above the image
- Gradient overlay provides sufficient contrast for text readability
- Embla Carousel is production-ready and performant
- Component is fully responsive without external CSS dependencies
- Images should be optimized (recommended: 1200x800px, 100KB max per image)
