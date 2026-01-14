'use client'
import React  from 'react'
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { XIcon } from '@/app/icons/XIcon';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectIsOpenConsultingModal, selectOrderCode, toggleConsultingModal } from '@/app/store/slices/consultingModalSlice/consultingModalSlice';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';


interface InitialValues {
  fullName: string;
  phone: string;
  email: string;
  time: string;
  product: string;
  description: string;
}
const ConsultingModal = () => {
  const isOpenModal = useAppSelector(selectIsOpenConsultingModal)
  const orderCode = useSelector(selectOrderCode)
  const dispatch = useAppDispatch()
  const t = useTranslations('ContactSection');
  const initialValues = {
    fullName: '',
    phone: '',
    email: '',
    time: '',
    product: '',
    description: '',
  };

  const validationSchema = Yup.object({
    fullName: Yup.string(),
    phone: Yup.string(),
    email: Yup.string().email(t('validations.3')).required(t('validations.2')),
    time: Yup.string(),
    product: Yup.string(),
    description: Yup.string(),
  });

  const handleSubmit = async(values: InitialValues, { resetForm }: FormikHelpers<InitialValues>) => {
    console.log('Form Data:', values);
    // Add your form submission logic here
    try {
      const sendMessage = {
        full_name: values.fullName,
        phone: values.phone,
        email: values.email,
        product: orderCode,
        description: values.description,
        comfort_time: values.time
      };

      await axios.post('https://backend.turniket.am/send-email', sendMessage);

      // 🔹 Отправляем событие в Google Analytics
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'form_submission', {
          event_category: 'Contact',
          event_label: orderCode || 'Unknown product',
          value: 1
        });
      }

      resetForm();
      toast.success(t('message.success'));
      dispatch(toggleConsultingModal({isview:false, orderCode: ''}))

    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(t('message.error'));
    }
    
  };

  return (
    <div style={{display: isOpenModal ? 'flex' : 'none'}} className='consulting_modal fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-55 flex justify-center items-center z-[99999999] max-sm:items-start'>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="max-w-[860px] flex flex-col gap-[20px] justify-center max-sm:justify-start items-center bg-white my_shadow p-[40px] max-sm:px-[10px] rounded-xl z-10 relative max-sm:h-[600px] max-sm:gap-[2vh] overflow-y-auto overflow-x-hidden max-sm:mt-[30px] max-sm:custom_scrollbar">
              <div className="flex flex-col justify-center items-center md:items-start gap-[20px] md:flex-row ">
                <div className="flex flex-col gap-[10px]">
                  <label className="freeSans font-normal text-[16px] leading-[24px] font_color">
                     {t('placeholders.0')}
                  </label>
                  <Field
                    name="fullName"
                    type="text"
                    className="border border-[#0E0449] h-[48px] w-[310px] max-md:w-[500px] max-sm:w-[300px] outline-none rounded pl-[15px] max-sm:h-[6vh]"
                  />
                </div>

                <div className="flex flex-col gap-[10px]">
                  <label className="freeSans font-normal text-[16px] leading-[24px] font_color">
                  {t('placeholders.1')}
                  </label>
                  <Field
                    name="phone"
                    type="text"
                    className="border border-[#0E0449] h-[48px] w-[310px] max-md:w-[500px] max-sm:w-[300px] outline-none rounded pl-[15px] max-sm:h-[6vh]"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center gap-[20px] md:flex-row items-center md:items-start">
                <div className="flex flex-col gap-[10px]">
                  <label className="freeSans font-normal text-[16px] leading-[24px] font_color">
                  {t('placeholders.2')}
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="border border-[#0E0449] h-[48px] w-[310px] max-md:w-[500px] max-sm:w-[300px] outline-none rounded pl-[15px] max-sm:h-[6vh]"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="flex flex-col gap-[10px]">
                  <label className="freeSans font-normal text-[16px] leading-[24px] font_color">
                  {t('placeholders.6')}
                  </label>
                  <Field
                    name="time"
                    type="text"
                    className="border border-[#0E0449] h-[48px] w-[310px] max-md:w-[500px] max-sm:w-[300px] outline-none rounded pl-[15px] max-sm:h-[6vh]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-[10px]">
                <label className="freeSans font-normal text-[16px] leading-[24px] font_color">
                {t('placeholders.7')}
                </label>
                <Field
                    value={orderCode || ''}
                    name="product"
                    type="text"
                    className="w-[640px] max-md:w-[500px] max-sm:w-[300px] h-[48px] border border-[#0E0449] rounded outline-none pl-[15px] max-sm:h-[6vh]"
                  />
              </div>

              <div className="flex flex-col gap-[10px]">
                <label className="freeSans font-normal text-[16px] leading-[24px] font_color">
                {t('placeholders.8')}
                </label>
                <Field
                  name="description"
                  as="textarea"
                  className="w-[640px] max-md:w-[500px] max-sm:w-[300px] h-[140px] border border-[#0E0449] rounded outline-none pl-[15px] max-sm:h-[14vh]"
                />
              </div>

              <button
                type="submit"
                className="text-white bg-[#5939F5] py-[7px] px-[15px] rounded"
              >
                {t('placeholders.9')}
              </button>
              <span className='absolute right-3 top-3 cursor-pointer' onClick={() => dispatch(toggleConsultingModal({isview:false, orderCode: ''}))}><XIcon width={16} height={16} color="#3A3A3A"/></span>
            </Form>
          )}
        </Formik>

    </div>
  )
}

export default ConsultingModal