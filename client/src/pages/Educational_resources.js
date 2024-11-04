import React from 'react';
import { useState } from 'react';
import Header from '../components/UI/Header';
import Section from '../components/UI/Section';
import Card from '../components/UI/Card';
import DropdownMenu from '../components/DropdownMenu';
import NetworkErrorMessage from '../components/NetworkErrorMessage';
import NoDataAvailableMessage from '../components/NoDataAvailableMessage';
import { FaBook } from 'react-icons/fa';

const educationalResources = [
    { title: 'Online Courses', link: 'https://www.coursera.org', category: 'Courses' },
    { title: 'Educational Videos', link: 'https://www.khanacademy.org', category: 'Videos' },
    { title: 'Research Papers', link: 'https://www.jstor.org', category: 'Research' },
    { title: 'Interactive Learning', link: 'https://www.edx.org', category: 'Interactive' },
    { title: 'Podcasts on Science', link: 'https://www.podcastaddict.com', category: 'Podcasts' }
];

const categories = ['All', 'Courses', 'Videos', 'Research', 'Interactive', 'Podcasts'];

const EducationalResources = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [error, setError] = useState(null);

    const onDropdownSelectHandler = category => {
        setSelectedCategory(category);
    };

    const filteredResources = selectedCategory === 'All'
        ? educationalResources
        : educationalResources.filter(resource => resource.category === selectedCategory);

    return (
        <>
            <Header title='Educational Resources' />
            <Section>
                {error ? (
                    <NetworkErrorMessage />
                ) : (
                    <>
                        <DropdownMenu
                            items={categories}
                            label='Filter by category'
                            onSelect={onDropdownSelectHandler}
                            className='mb-5'
                            excludeAllOption={false}
                        />
                        <div className='mb-5 grid grid-cols-2 gap-5'>
                            {filteredResources.length > 0 ? (
                                filteredResources.map((resource, index) => (
                                    <Card key={index} className='p-5'>
                                        <div className='flex flex-col items-center'>
                                            <FaBook className='text-3xl text-blue-500 mb-3' />
                                            <a
                                                href={resource.link}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='text-xl font-bold text-blue-600 hover:underline'
                                            >
                                                {resource.title}
                                            </a>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <NoDataAvailableMessage />
                            )}
                        </div>
                    </>
                )}
            </Section>
        </>
    );
};

export default EducationalResources;