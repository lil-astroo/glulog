import React from 'react'

import '../assets/styles/WidgetLg.css'

export default function WidgetLg({ children }) {
    return (
        <div className='widgetLg__container'>
            {children}
        </div>
    )
}
