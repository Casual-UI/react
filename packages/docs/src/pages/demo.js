import React, { useState } from 'react'
import { CCarousel, CCarouselSlider } from '@casual-ui/react'

export default function Demo() {
  const [activeIndex, setActiveIndex] = useState(0)

  const itemStyle = {
    height: '300px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '100px',
  }

  return (
    <CCarousel
      infinity
      activeIndex={activeIndex}
      onActiveIndexChange={setActiveIndex}
    >
      <CCarouselSlider>
        <div style={itemStyle}>Slider1</div>
      </CCarouselSlider>
      <CCarouselSlider>
        <div style={itemStyle}>Slider2</div>
      </CCarouselSlider>
      <CCarouselSlider>
        <div style={itemStyle}>Slider3</div>
      </CCarouselSlider>
    </CCarousel>
  )
}
