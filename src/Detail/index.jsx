// src/Detail/index.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Discount from "../Discount";
import Nav from "react-bootstrap/Nav";
import TabContent from "../TabContent";

function Detail({product}){
  let [detailFade, setDetailFade] = useState('');
  const [showAlert, setShowAlert] = useState(true);

  const [inputData, setInputData] = useState('');
  const [state, setState] = useState(false);

  const [tabState, setTabState] = useState(0);

  useEffect(()=>{
    const timer = setTimeout(() => setDetailFade('ani_end'), 100);
    return ()=>{ clearTimeout(timer); setDetailFade(''); }
  },[]);

  useEffect(()=>{
    const myTimer = setTimeout(()=> setShowAlert(false), 2000);
    return ()=> clearTimeout(myTimer);
  }, []);

  useEffect(()=>{
    if(isNaN(inputData)) setState(true); else setState(false);
  }, [inputData]);

  let {id} = useParams();
  const navigate = useNavigate();

  const findProduct = product.find(item => item.id === Number(id));

  if(findProduct == null){
    alert('찾는 상품이 없습니다.');
    navigate(-1);
    return null;
  }

  return(
    <div className={`container ani_start ${detailFade}`}>
      <div className="container mt-2">
        {showAlert && <Discount />}
      </div>

      <div className="row">
        <div className="col-md-6">
          <img src={`/images/shoes${findProduct.id+1}.jpg`} width="100%" alt={findProduct.title}/>
        </div>
        <div className="col-md-6">
          <h4 className="pt-5">{findProduct.title}</h4>
          <p>{findProduct.content}</p>
          {/* {state && <div>오류</div>}
          <p>수량 :
            <input type="text" onChange={(e)=>{setInputData(e.target.value)}}/>
          </p> */}
          <p>{findProduct.price}</p>
          <button className="btn btn-danger">주문하기</button>
        </div>
      </div>

      {/* ✅ 리뷰 탭 포함 */}
      <Nav variant="tabs" activeKey={`link-${tabState}`} className="mt-3">
        <Nav.Item>
          <Nav.Link eventKey="link-0" onClick={()=>setTabState(0)}>특징</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-1" onClick={()=>setTabState(1)}>사이즈</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2" onClick={()=>setTabState(2)}>배송</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-3" onClick={()=>setTabState(3)}>리뷰</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* 선택한 탭 콘텐츠 */}
      <TabContent tabState={tabState} id={findProduct.id} />
    </div>
  )
}
export default Detail;
