import "./App.css"
import AppNavBar from './AppNavbar'

// assets 폴더 내의 이미지 사용법 -> import 해서 사용
import bg_png from "./assets/images/bg.png"
import img_2 from "./assets/images/shoes2.jpg"
import { Container, Row, Col } from 'react-bootstrap';
import data from  './data/data';
import { useState } from "react";


function App() {
 //상품정보를 갖는 product 스텡이트를 만든다.
 const [product, setProduct] = useState(data);
 console.log(product)
  return (
    <>
      {/*네비게이션 바 영역시작//*/}
      <AppNavBar />
      {/* //네비게이션 바 영역 끝*/}

      {/* //메인 대문사진 영역시작*/}
      <div className='main-bg' />
      {/* //메인 대문사진영역 끝 */}
      {/* 상품진열영역 시작 */}

      {/* 상품진열영역 시작 */}
      <Container fluid>
        <Row>
          <Col className='text-center'>
           <img src="https://zzzmini.github.io/images/shoes1.jpg" 
           width="80%"  />
           <h4>상품명</h4>
           <p>상품설명</p>
          </Col>
           <Col>
           <img src={img_2}
           width="80%"  />
           <h4>상품명</h4>
           <p>상품설명</p>
          </Col>
           <Col>
           <img src="/imges/shoes3.jpg" 
           width="80%"  />
           <h4>상품명</h4>
           <p>상품설명</p>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default App
