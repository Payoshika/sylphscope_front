import React from 'react'
import PlusSign from '../components/icons/PlusSign'

type TitleAndHeadLineProps = {
    title: string
    headline: string
    provider?: boolean
    student?: boolean
}

const TitleAndHeadLine: React.FC<TitleAndHeadLineProps> = ({ title, headline, provider, student }) => {
    return (
        <div className='grant-create-headline'>
            <h3 className="grant-create-headline__title">{title}</h3>
            <h5 className="grant-create-headline__text" >
                <PlusSign provider={provider} student={student} /> {headline}
            </h5>
        </div>
    )
}

export default TitleAndHeadLine