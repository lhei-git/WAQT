import React, {useRef} from 'react';
import  ReactToPrint, { useReactToPrint }  from 'react-to-print';
import Display from './display'

const printButton = () => {
    const componentRef = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'data',
        onAfterPrint: () => alert('Print Success')
    });
    return (
        <>
        <div ref ={componentRef} style = {{width: '100%', height: window.innerHeight}}>
            {/* <Display/> */}
        </div>
        <button onClick={handlePrint}>Print</button>
        </>
    )
}

export default printButton