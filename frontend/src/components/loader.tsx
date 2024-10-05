import { IconLoader } from '@tabler/icons-react'
import { useLoader } from '../context/loaderContext';

const Loader = () => {
    const { loading } = useLoader();

    if (!loading) return null;
    return (
      <div className='loader-overlay'>
        <IconLoader className='animate-spin' size={32} />
        <span className='sr-only'>loading</span>
      </div>
    )
};

export default Loader;
