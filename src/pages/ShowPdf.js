import React, { useState, useEffcet } from "react";
import { useParams, useLocation } from "react-router-dom";
import tw from "twin.macro";
import styled from "styled-components";
import { Document, Page, pdfjs } from 'react-pdf';
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import test from '../assets/test.pdf'

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
const ButtondContainer = styled.button`
${tw`bg-indigo-500 rounded-lg text-base h-8 text-xl/8 mr-2 ml-2 px-2`}
`;


const ShowPdf = () => {
    const [numPages, setNumPages] = useState(null); //pdf total pages
    const [pageNumber, setPageNumber] = useState(1); //current page
    const [visible, setVisible] = useState(true);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [file, setFile] = useState(searchParams.get('file'));
    // const {  } = useParams
    // console.log('file', useParams, useLocation)
    console.log('file', file)

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    const handlePrint = () => {
        setVisible(!visible)
        setTimeout(() => {
            window.print()
            setTimeout(() => {
                setVisible(visible)
            }, 500)
        }, 500)
        // let oldStr = window.document.body.innerHTML;
        // let newStr = document.getElementById('showPdf11').innerHTML;
        // window.document.body.innerHTML = newStr;
        // window.print();
        // window.document.body.innerHTML = oldStr;
        // window.document.body.innerHTML = window.document.getElementById('showPdf11').innerHTML;  
        // window.print(); 
        // window.location.reload();
    }
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }} id="showPdf11">
                {
                    file &&
                    
                    <Document file={"https://gsop.oss-ap-southeast-1.aliyuncs.com/GSOP/20231204/a1a0445c2e337ce8704117e8feb79b82.pdf"} onLoadSuccess={onDocumentLoadSuccess} error='Load document failed' loading='Loading, Please wait...'>
                        {/* <Page scale={1.5} pageNumber={pageNumber} /> */}
                        {
                            new Array(numPages).fill('').map((item, index) => (
                                <Page className='mb24' scale={1.5} key={index} pageNumber={index + 1} />
                            ))
                        }

                    </Document>
                }

            </div>
            <div style={{ width: '100%', textAlign: 'center', marginBottom: "30px" }}>
                {
                    visible && <ButtondContainer onClick={handlePrint}>Print</ButtondContainer>
                }

            </div>
            {/* <p style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center',fon }}>
                Page {pageNumber} of {numPages}
            </p> */}
        </div>
    )
}
export default ShowPdf;