import { useImageLazyLoad } from '../hooks/useImageLazyLoad';

function LazyImage({ src, isVisible }) {
  const { isLoading } = useImageLazyLoad(src, isVisible);

  if (!isVisible) {
    console.log('isVisible is false');
    return null;
  }
  if (isVisible && isLoading) {
    console.log('isLoading is true');
    return (<div>is loading...</div>)
  }
  if (isVisible && !isLoading) {
    console.log('isLoading is false');
    return (<img className='sm:max-w-[200px] rounded-md mb-2'
      src={src}
      alt='message image' />)
  }
  return null;
}

export default LazyImage;