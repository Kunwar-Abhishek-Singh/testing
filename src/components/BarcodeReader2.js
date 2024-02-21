import {useState} from 'react';
import {BarcodeScanner} from '@thewirv/react-barcode-scanner';

const Test2 = (props: Props) => {
  const [data, setData] = useState('No result');

  return (
    <>
      <BarcodeScanner
        onSuccess={(text) => setData(text)}
        onError={(error) => {
          if (error) {
            console.error(error.message);
          }
        }}
        onLoad={() => console.log('Video feed has loaded!')}
        containerStyle={{width: '100%'}}
      />
      <p>{data}</p>
    </>
  );
};
export default Test2;