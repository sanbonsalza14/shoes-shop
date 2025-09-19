// src/TabContent/index.jsx
import { useEffect, useState } from "react";
import DetailInfo from "../TabInfo/DetailInfo";
import SizeGuide from "../TabInfo/SizeGuide";
import Shipping from "../TabInfo/Shipping";
import ReviewTab from "../TabDetail";     // ✅ 폴더의 index.jsx(default export)

function TabContent({ tabState, id }) {
  let [fade, setFade] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setFade("ani_end"), 100);
    return () => { clearTimeout(t); setFade(""); };
  }, [tabState]);

  return (
    <div className={`ani_start ${fade}`}>
      {
        [
          <DetailInfo id={id} />,
          <SizeGuide />,
          <Shipping />,
          <ReviewTab productId={id} />,   // ✅ 3번 인덱스(리뷰)
        ][tabState]
      }
    </div>
  );
}
export default TabContent;
