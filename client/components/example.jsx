import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteData, fetchAsyncValue } from '../reducers/example';

function Example() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.example.data);
  const status = useSelector((state) => state.example.status);

  // Dispatch the fetchCounterValue thunk when the component mounts
  useEffect(() => {
    dispatch(fetchAsyncValue());
  }, [dispatch]);

  return (
    <div>
      <h1>
        Joke:
        {data}
      </h1>

      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error fetching data.</p>}

      <button type="button" onClick={() => dispatch(deleteData())}>Delete Data</button>
      <button type="button" onClick={() => dispatch(fetchAsyncValue())}>Fetch Data</button>
    </div>
  );
}

export default Example;
