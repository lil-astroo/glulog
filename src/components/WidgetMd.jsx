import React from 'react'

import '../assets/styles/WidgetMd.css'

export default function WidgetMd({ children }) {
    return (
        <div className='widgetMd__container'>
            {children}
        </div>
    )
}
