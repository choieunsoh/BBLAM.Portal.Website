﻿var $projects = [
    {
        dept: 'BP',
        name: 'ปรับปรุงการคำนวณกลุ่ม ตราสารระยะสั้น (Revise CP model pricing/Multiplier scheme)',
        dev: 'Achara',
        man_day: 30,
        kpi: true,
    },
    {
        dept: 'BP',
        name: 'Automate QC MTM process',
        dev: 'Achara',
        man_day: 20,
        kpi: true,
    },
    {
        dept: 'BP',
        name: 'Revise SOEG Quote & Model pricing (Phase II)',
        dev: 'Achara',
        man_day: 12,
        kpi: true,
    },
    {
        dept: 'BP',
        name: 'สร้างระบบ Daily process ให้เป็น Automatic และมีประสิทธิภาพมากขึ้น',
        dev: 'Kiattipong',
        man_day: 30,
        kpi: true,
    },
    {
        dept: 'BP',
        name: 'RP using Model yield',
        dev: 'Achara',
        man_day: 40,
        kpi: true,
    },
    {
        dept: 'BP',
        name: 'ปรับปรุงระบบ Subsystem ของ Bond Pricing  - CorpIndexOld',
        dev: 'Achara',
        man_day: 15,
        kpi: true,
    },
    {
        dept: 'BP',
        name: 'ปรับปรุงระบบ Subsystem ของ Bond Pricing  - Richcheap',
        dev: 'IT5',
        man_day: 30,
        kpi: false,
    },
    {
        dept: 'BP',
        name: 'ปรับปรุงระบบ Subsystem ของ Bond Pricing  - AlternativeYC (Upload)',
        dev: 'IT5',
        man_day: 25,
        kpi: false,
    },
    {
        dept: 'BP',
        name: 'จัดทำ Gov’t YC ที่ไม่พึ่งพาการ Quote เพื่อรองรับกรณีที่ PD no quote',
        dev: 'Kiattipong',
        man_day: 60,
        kpi: true,
    },
    {
        dept: 'BP',
        name: 'จัดทำ ZYC ที่ได้จากเส้น Government Bond Yield Curve ในรูปแบบใหม่ (Upload)',
        dev: 'Kiattipong',
        man_day: 25,
        kpi: true,
    },
    {
        dept: 'BP',
        name: 'ปรับปรุงวิธีการสร้าง ZYC โดยใช้ Hermite spline model',
        dev: 'Achara',
        man_day: 25,
        kpi: false,
    },
    {
        dept: 'BP',
        name: 'สร้างระบบการตรวจสอบราคา MTM ในตลาดสำหรับ Exotic product - Callable/Puttable Bond, Convertible bond ใช้วิธี upload เท่านั้น',
        dev: 'Yatawee',
        man_day: 22,
        kpi: false,
    },
    {
        dept: 'BP',
        name: 'Web service API systemและความปลอดภัยของการให้บริการ iData Service',
        dev: 'Mayuree',
        man_day: 40,
        kpi: true,
    },
    {
        dept: 'BP',
        name: 'iBond training online',
        dev: 'Jantira',
        man_day: 120,
        kpi: false,
    },
    {
        dept: 'BP',
        name: 'FAQ iBond',
        dev: 'Phornphimol',
        man_day: 10,
        kpi: false,
    },
    {
        dept: 'BP',
        name: 'End-of-day MTM package for member (20 bonds)**',
        dev: 'Achara',
        man_day: 40,
        kpi: true,
    },
    {
        dept: 'BP',
        name: 'Revise การจัดทำ Risk level ให้มีความเหมาะสมกับความเสี่ยงของตราสารต่างๆในตลาด',
        dev: 'Achara',
        man_day: 30,
        kpi: true,
    },
    {
        dept: 'BR',
        name: 'พัฒนาระบบ Registrar Service Platform Phase 1 (POC)',
        dev: 'Napat',
        man_day: 250,
        kpi: false,
    },
    {
        dept: 'BR',
        name: 'พัฒนาระบบ Registrar Service Platform Phase 1 (POC)',
        dev: 'Mayuree',
        man_day: 120,
        kpi: true,
    },
    {
        dept: 'BR',
        name: 'พัฒนาระบบ Registrar Service Platform Phase 1 (POC)',
        dev: 'Kiattipong',
        man_day: 100,
        kpi: true,
    },
    {
        dept: 'BR',
        name: 'สร้างระบบเรียกดูข้อมูลที่เชื่อมโยงฐานข้อมูลทั้ง non-registered bond และ registered bond รวมเป็นฐานข้อมูลกลาง เชื่อมต่อไปที่ Tableau เพื่อฝ่ายต่างๆนำไปใช้วิเคราะห์ข้อมูลสำหรับพัฒนาตลาด',
        dev: 'Mayuree',
        man_day: 30,
        kpi: true,
    },
    {
        dept: 'BR',
        name: 'ทำการเชื่อมโยงข้อมูลกับ API ของ BOT  ที่เกี่ยวข้องกับตราสารหนี้ เพื่อให้ระบบ update ข้อมูลได้อัตโนมัติ ซึ่งช่วยลดกระบวนการทำงานภายใน',
        dev: 'IT5',
        man_day: 30,
        kpi: false,
    },
    {
        dept: 'BR',
        name: 'เพิ่มการแสดงข้อมูลตราสารหนี้ระยะยาว และการคำนวณราคาได้ก่อน issue date บน website ThaiBMA, ibond เพื่อให้ underwriter/ investor สามารถคำนวณราคาและทราบข่าวการออกตราสารหนี้ล่วงหน้า',
        dev: 'Achara',
        man_day: 30,
        kpi: false,
    },
    {
        dept: 'BR',
        name: 'เพิ่มฟังก์ชั่นใน issuer gateway เพื่อรองรับความต้องการของผู้ออกตราสารหนี้ที่จะนำข้อมูลไปใช้',
        dev: 'IT5',
        man_day: 20,
        kpi: false,
    },
    {
        dept: 'BR',
        name: 'พัฒนา e-Long-term Registration) Phase 2',
        dev: 'Mayuree',
        man_day: 60,
        kpi: true,
    },
    {
        dept: 'BR',
        name: 'พัฒนาระบบงานขึ้นทะเบียนตราสารหนี้ระยะสั้น/ยาว ให้เป็นอัตโนมัติเพื่อเพิ่มประสิทธิภาพในการทำงานยิ่งขึ้น และลดความผิดพลาดทำงานร่วมกับกลต.',
        dev: 'Yatawee',
        man_day: 60,
        kpi: false,
    },
    {
        dept: 'SV',
        name: 'เพิ่มประสิทธิภาพในการกำกับดูแล ในรูปแบบของ Internal Dashboard',
        desc: 'เพิ่มประสิทธิภาพในการกำกับดูแล โดยการทำ Surveillance Module Integration และจัดแสดงผล Real-time ในรูปแบบของ Internal Dashboard',
        dev: 'Yatawee',
        man_day: 100,
        kpi: false,
    },
    {
        dept: 'SV',
        name: 'พัฒนาระบบรายงานสำหรับ IDB',
        dev: 'IT5',
        man_day: 45,
        kpi: false,
    },
    {
        dept: 'SV',
        name: 'เพิ่มกลุ่ม บ.ประกัน ให้รวมในการจัดอันดับ Top 2 หน้า Daily Market Highlight  / เพิ่มให้เห็นทุกกลุ่มที่มีในปัจจุบัน (ทำเลยก็ได้นะครับ)',
        dev: 'IT5',
        man_day: 10,
        kpi: false,
    },
    {
        dept: 'AF',
        name: 'จัดหาระบบบัญชี',
        dev: 'Thanawat',
        man_day: 60,
        kpi: true,
    },
    {
        dept: 'RR',
        name: 'Register Seminar + QR Code',
        dev: 'Yatawee',
        man_day: 60,
        kpi: true,
    },
    {
        dept: 'RR',
        name: 'สื่อโฆษณา ภาพนิ่ง',
        dev: 'Jantira',
        man_day: 125,
        kpi: false,
    },
    {
        dept: 'RR',
        name: 'สื่อโฆษณา ภาพนิ่ง',
        dev: 'Phornphimol',
        man_day: 125,
        kpi: false,
    },
    {
        dept: 'RR',
        name: 'Bond Ben the series 12 เรื่อง',
        dev: 'Phornphimol',
        man_day: 125,
        kpi: false,
    },
    {
        dept: 'RI',
        name: 'E-book',
        dev: 'Achara',
        man_day: 5,
        kpi: false,
    },
    {
        dept: 'AF',
        name: 'จัดทำระบบ E-tax invoice / E-receipt ที่สามารถเชื่อมโยงกับระบบ CRM เพื่ออำนวยความสะดวกให้กับ issuer และคู่ค้า (iTextSharp)',
        dev: 'IT5',
        man_day: 60,
        kpi: false,
    },
    {
        dept: 'AM',
        name: 'CRM Phase 3',
        dev: 'IT5',
        man_day: 30,
        kpi: false,
    },
];