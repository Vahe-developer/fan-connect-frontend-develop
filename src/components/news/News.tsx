import React, {useEffect, useState} from 'react'
import {
    DropDown,
    Container,
    Wrapper,
    Loadable,
    Image,
    Button,
    styled,
}                                   from '@myfan/web-components'
import {withContext}                from '@myfan/store'
import {Club}                       from '@myfan/base'
import {News}                       from '@myfan/pages'
import {Global, Types}              from '@myfan/commons'
import {IntlHtmlText}               from '../intl/IntlText'

const {withNews} = News

type NewsViewT = {
                     intl: Types.IntlShape
                 } & News.WithNews

const NewsCategory = styled.div`
    position: absolute;
    min-width: 80px;
    height: 24px;
    right: 0;
    bottom: 0;
    background: ${Club.mobile.mainBackgroundColor};
    text-align: center;
    color: white;
    padding: 2px;
`

const NewsTime = styled.div`
    margin: 24px 0;
    color:  ${Club.mobile.mainBackgroundColor};
    font-size:  24px;
    text-align: right;
    
    i {
        display : inline-block!important;
    }
    
    span {
        margin-left: 8px;
        display: inline-block;
    }
`

const NewsItemWrapper = styled.div`  
    padding: 16px 0; 
        
    .fas.fa-clock {
        display: block;
        text-align: right;
    }
`

const Description = styled.div`
    text-align: left;
    margin-top : 16px;
    background : #fafafa;
    
    .text {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3; /* number of lines to show */
        line-height: X;        /* fallback */
        max-height: X*3;       /* fallback */
        
        //&:hover {
        //    overflow: visible;
        //}
    }  
    
`

const PointerHover = styled.div`
    &:hover {
        cursor: pointer;
    }
`

const NewsWrapper = styled(Wrapper)`
    text-align: center;
`

const NewsImage: React.FC<{ category: string, onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void }> = props => {
    return (
        <PointerHover
            className={'news-with-category'}
            style={{position: 'relative'}}
            {...props}
        >
            {props.children}
            <NewsCategory className={'news-category text'}>
                {props.category}
            </NewsCategory>
        </PointerHover>
    )
}

const NewsView = ({intl, data, loading, setFilters}: NewsViewT) => {

    const [newsData, setNewsData]             = useState(data)
    const [initialLoading, setInitialLoading] = useState<boolean>(loading)
    const [moreLoading, setMoreLoading]       = useState<boolean>(loading)

    useEffect(() => {
        setNewsData(prev => ({
            ...prev,
            news: [
                ...prev.news,
                ...data.news,
            ],
        }))
    }, [data])

    useEffect(() => {
        setInitialLoading(false)
        setMoreLoading(loading)
    }, [loading])

    const onDescriptionClick = (event: React.MouseEvent<HTMLDivElement>) => {
        Global.window.open(event.currentTarget.dataset.url, '_blank')
    }

    const onSelect = (category: any) => {
        setFilters({
            filters: [{
                name     : 'category',
                condition: 'eq',
                value    : category.target.value,
            }],
            page   : {
                current: 1,
                per    : 10,
            },
        })
        setNewsData(prev => ({
            ...prev,
            news: [],
        }))
    }

    return (
        <Container>
            <div
                className={'title'}
                style={{
                    fontWeight: 'bold',
                    textAlign : 'center',
                }}
            >
                {IntlHtmlText('news.header', {color: Club.mobile.mainBackgroundColor})}
            </div>
            <Loadable loading={initialLoading}>
                <div style={{margin: '16px auto', maxWidth: '320px'}}>
                    <DropDown
                        name={'category'}
                        // @ts-ignore
                        data={data.categories}
                        title={intl.formatMessage({id: 'news.categories'})}
                        onSelect={onSelect}
                        styles={{
                            selectedColor: 'grey',
                        }}
                    />
                </div>
                <NewsWrapper className={'news-wrapper'}>
                    {newsData
                        .news
                        .map((list: News.TNews) => {
                            return (
                                <NewsItemWrapper key={list.url}>
                                    {/*
                                    // @ts-ignore*/}
                                    <NewsImage
                                        //category={intl.formatMessage({id: getCategory(list.categoryId)})}
                                        category={list.categoryId}
                                        data-url={list.url}
                                        onClick={onDescriptionClick}
                                    >
                                        {/* // @ts-ignore*/}
                                        <Image src={list.image}/>
                                    </NewsImage>
                                    <Description>
                                        <PointerHover
                                            data-url={list.url}
                                            onClick={onDescriptionClick}
                                            className={'title'}
                                        >
                                            {list.title}
                                        </PointerHover>
                                        <div
                                            className={'text'}
                                            // @ts-ignore
                                            dangerouslySetInnerHTML={{__html: list.description}}
                                        />
                                        <NewsTime>
                                            <i className={'fas fa-clock'}>
                                            </i>
                                            <span className={'sub-title'}>
                                                    {intl.formatDate(list.date, {
                                                        month: 'long',
                                                        day  : '2-digit',
                                                    })}
                                                </span>
                                        </NewsTime>
                                    </Description>
                                </NewsItemWrapper>
                            )
                        })}
                </NewsWrapper>
                {/*
                // @ts-ignore*/}
                {data.pageCount !== data.page && newsData.news.length > 0 && (
                    <Button
                        className={'title'}
                        disabled={moreLoading}
                        onClick={() => {
                            // @ts-ignore
                            setFilters(prev => ({
                                ...prev,
                                page: {
                                    current: prev.page.current + 1,
                                    per    : 10,
                                },
                            }))
                            setMoreLoading(true)
                        }}
                        loading={moreLoading}
                    >
                        More
                    </Button>
                )}
            </Loadable>
        </Container>
    )
}

export default withNews(withContext(NewsView))
