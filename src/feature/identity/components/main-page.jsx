import Card from "../../../components/card.jsx";
import Carousel from "../../../components/carousel.jsx";
import ReactiveButton from "reactive-button";
import {useState} from "react";
import Lottie from "lottie-react";
import logo from "@assets/creditcard.json";
import ChangeBank from "../../bank/components/change-bank.jsx";
import {useForm} from "react-hook-form";
import DevelopingMode from "../../../components/developing-mode.jsx";
import Result from "../../../components/result.jsx";
import {useBankContext} from "../../../contexts/bank/bank-context.jsx";
import defaultImage from "@assets/bank-iran/no-img.png";
import {toast} from "react-toastify";
import IBAN from "../../../utilities/Converter.ts";
import ChangeBankAccountType from "../../bank/components/changeBankAccountType.jsx";
import {Helmet} from "react-helmet-async";


const MainPage = () => {
    const cards = 3;
    const [selectedBankId, setSelectedBankId] = useState();
    const [selectedBankType, setSelectedBankType] = useState();
    const [accountConvert, setAccountConvert] = useState('idle');
    const [cartConvert, setCartConvert] = useState('idle');
    const [cartToAccount, setCartToAccount] = useState('idle');
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState();
    const {resetBank} = useBankContext();
    const [bankDetails, setBankDetails] = useState({
        name: "",
        id: "",
        image: defaultImage,
    });
    const {
        register,
        formState: {errors},
        handleSubmit,
        watch,
        reset
    } = useForm();
    const {
        register: registerCartToSheba,
        formState: {errors: errorsCartToSheba},
        handleSubmit: handleSubmitCartToSheba,
        watch: watchCartToSheba
    } = useForm();
    const {
        register: registerCartToAccount,
        formState: {errors: errorsCartToAccount},
        handleSubmit: handleSubmitCartToAccount,
        watch: watchCartToAccount
    } = useForm();
    const handleBackToDefault = () => {
        resetBank();
        reset();
        setAccountConvert('idle');
        setSelectedBankId(null);
        setSelectedBankType(null);
        setShowResult(false);
    };
    const accountToShebaConvert = (inputName) => {
        const dataWithBankId = {selectedBankId, selectedBankType, [inputName]: watch(inputName)};
        setAccountConvert('loading');
        setTimeout(() => {
            console.log(dataWithBankId.selectedBankType);
            if (!errors[inputName] && selectedBankId != null && selectedBankType != null) {
                var result = new IBAN(dataWithBankId.accountToSheba, dataWithBankId.selectedBankId, dataWithBankId.selectedBankType, "IR");
                console.log(result.Value);
                setResult(result.Value);
                setAccountConvert('success');
                setShowResult(true);
            } else {
                setAccountConvert('error');
                selectedBankId === undefined ?
                    toast.error('بانک مورد نظر انتخاب نشده است !', {
                        position: "bottom-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        toastId: 'bankError',
                    })
                    : undefined;
                selectedBankType === undefined ?
                    toast.error('نوع حساب انتخاب نشده است !', {
                        position: "bottom-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        toastId: 'bankTypeError',
                    }) : undefined;

            }
        }, 2000);
    };
    const cartToShebaConvert = (inputName) => {
        const data = {[inputName]: watchCartToSheba(inputName)};
        setCartConvert('loading');
        setTimeout(() => {
            if (!errorsCartToSheba[inputName]) {
                console.log(data);
                setCartConvert('success');
            } else {
                setCartConvert('error')
            }
        }, 2000);
    };
    const cartToAccountConvert = (inputName) => {
        const data = {[inputName]: watchCartToAccount(inputName)};
        setCartToAccount('loading');
        setTimeout(() => {
            if (!errorsCartToAccount[inputName]) {
                console.log(data);
                setCartToAccount('success');
            } else {
                setCartToAccount('error')
            }
        }, 2000);
    };
    return (
        <>
            <div>
                <Helmet>
                    <title>شباویز</title>
                    <meta name="description" content="تبدیل رایگان شماره کارت و شماره حساب به شماره شبا بانک‌ها"/>
                    <meta name="keywords"
                          content="تبدیل رایگان شماره کارت,بانک,شماره شبا,شماره حساب,شماره کارت,تبدیل شماره حساب به شماره شبا,تبدیل شماره کارت به شماره شبا,تبدیل شماره کارت به شماره حساب"/>
                    <meta property="og:title" content="شباویز"/>
                    <meta property="og:description"
                          content="تبدیل رایگان شماره کارت و شماره حساب به شماره شبا بانک‌ها"/>
                    <meta property="og:url" content="https://shebawiz.ir"/>
                    <meta name="twitter:title" content="شباویز"/>
                    <meta name="twitter:description"
                          content="تبدیل رایگان شماره کارت و شماره حساب به شماره شبا بانک‌ها"/>
                </Helmet>
            </div>
            <div className='text-center mt-4'>
                <h1 className="h2 fw-bolder">شبــــاویــــز</h1>
                <p className="text-muted lead fw-bold ">تبدیل رایگان شماره کارت و شماره حساب به شماره شبا بانک‌ها</p>
                <Lottie animationData={logo} style={{width: '50%', margin: '0px auto'}}/>
            </div>
            <div className='mb-7'>
                <Carousel>
                    {[...new Array(cards)].map((_, i) => (
                        i === 1 ? (
                            <Card
                                onSubmit={handleSubmit(accountToShebaConvert)}
                                key={i}
                                title={showResult ? <img src={bankDetails.image} alt={bankDetails.name}
                                                         style={{width: '50px', height: '50px'}}/> : 'حساب به شبا'}
                                content={
                                    showResult ? (
                                        <Result result={result}
                                                onBackToDefault={handleBackToDefault}
                                                bankDetails={bankDetails}
                                        />
                                    ) : (
                                        <div className='mb-3' style={{direction: 'rtl'}}>
                                            <label className="form-label">
                                                شماره حساب
                                            </label>
                                            <input  {...register('accountToSheba', {
                                                required: 'شماره حساب وارد نشده است !',
                                                minLength: 10,
                                                maxLength: 24,
                                                // custom validator
                                                validate: value => {
                                                    if (watch('accountToSheba') === null) {
                                                        return 'شماره حساب اشتباه است'
                                                    }
                                                }
                                                // custom validator
                                            })}
                                                    autoComplete="off"
                                                    className={`form-control form-control-lg bg-transparent text-bg-dark ${errors.accountToSheba && 'is-invalid'}`}
                                                    placeholder={'شماره حساب را وارد کنید '}/>
                                            {
                                                errors.accountToSheba && errors.accountToSheba.type === 'required' && (
                                                    <p className='text-danger small fw-bold mt-1'>
                                                        {errors.accountToSheba?.message}
                                                    </p>
                                                )
                                            }{
                                            errors.accountToSheba && (errors.accountToSheba.type === 'minLength' || errors.accountToSheba.type === 'maxLength') &&
                                            (
                                                <p className='text-danger small fw-bold mt-1'>
                                                    شماره حساب صحیح نیست
                                                </p>
                                            )
                                        }{
                                            errors.accountToSheba && errors.accountToSheba.type === 'validate' && (
                                                <p className='text-danger small fw-bold mt-1'>
                                                    {errors.accountToSheba?.message}
                                                </p>
                                            )
                                        }
                                            <div className='d-flex justify-content-between'>
                                                <ChangeBank onBankSelected={(bankId) => setSelectedBankId(bankId)}
                                                            setBankDetails={setBankDetails}/>
                                                <ChangeBankAccountType
                                                    onBankTypeChange={(selectedBankType) => setSelectedBankType(selectedBankType)}/>
                                            </div>
                                            <div className='text-center mt-4'>
                                                <ReactiveButton
                                                    shadow
                                                    rounded
                                                    buttonState={accountConvert}
                                                    idleText="دریافت شماره شبا"
                                                    loadingText="در حال تبدیل ..."
                                                    successText="عملیات با موفقیت انجام شد"
                                                    errorText="عملیات ناموفق !"
                                                    onClick={() => accountToShebaConvert('accountToSheba')}
                                                    type='submit'
                                                />
                                            </div>
                                        </div>
                                    )
                                }
                            />
                        ) : i === 2 ? (
                            <Card
                                onSubmit={handleSubmitCartToSheba(cartToShebaConvert)}
                                key={i}
                                title={'کارت به شبا'}
                                content={
                                    <div className='mb-3' style={{direction: 'rtl'}}>
                                        <label className="form-label">
                                            شماره کارت
                                        </label>
                                        <input  {...registerCartToSheba('cartToSheba', {
                                            required: 'شماره کارت وارد نشده است !',
                                            minLength: 16,
                                            maxLength: 16,
                                            // custom validator
                                            validate: value => {
                                                if (watchCartToSheba('cartToSheba') === null) {
                                                    return 'شماره کارت اشتباه است'
                                                }
                                            }
                                            // custom validator
                                        })}
                                                autoComplete="off"
                                                className={`form-control form-control-lg bg-transparent text-bg-dark ${errorsCartToSheba.cartToSheba && 'is-invalid'}`}
                                                placeholder={'شماره حساب را وارد کنید '}/>
                                        {
                                            errorsCartToSheba.cartToSheba && errorsCartToSheba.cartToSheba.type === 'required' && (
                                                <p className='text-danger small fw-bold mt-1'>
                                                    {errorsCartToSheba.cartToSheba?.message}
                                                </p>
                                            )
                                        }{
                                        errorsCartToSheba.cartToSheba && (errorsCartToSheba.cartToSheba.type === 'minLength' || errorsCartToSheba.cartToSheba.type === 'maxLength') &&
                                        (
                                            <p className='text-danger small fw-bold mt-1'>
                                                شماره کارت صحیح نیست
                                            </p>
                                        )
                                    }{
                                        errorsCartToSheba.cartToSheba && errorsCartToSheba.cartToSheba.type === 'validate' && (
                                            <p className='text-danger small fw-bold mt-1'>
                                                {errorsCartToSheba.cartToSheba?.message}
                                            </p>
                                        )
                                    }
                                        <DevelopingMode/>
                                        <div className='text-center mt-4'>
                                            <ReactiveButton
                                                shadow
                                                rounded
                                                buttonState={cartConvert}
                                                idleText="دریافت شماره شبا"
                                                loadingText="در حال تبدیل ..."
                                                successText="عملیات با موفقیت انجام شد"
                                                errorText="عملیات ناموفق !"
                                                onClick={() => cartToShebaConvert('cartToSheba')}
                                                type='submit'
                                            />
                                        </div>
                                    </div>
                                }
                            />
                        ) : (
                            <Card
                                onSubmit={handleSubmitCartToAccount(cartToAccountConvert)}
                                key={i}
                                title={'کارت به حساب'}
                                content={
                                    <div className='mb-3' style={{direction: 'rtl'}}>
                                        <label className="form-label">
                                            شماره کارت
                                        </label>
                                        <input  {...registerCartToAccount('cartToAccount', {
                                            required: 'شماره کارت وارد نشده است !',
                                            minLength: 16,
                                            maxLength: 16,
                                            // custom validator
                                            validate: value => {
                                                if (watchCartToAccount('cartToAccount') === null) {
                                                    return 'شماره کارت اشتباه است'
                                                }
                                            }
                                            // custom validator
                                        })}
                                                autoComplete="off"
                                                className={`form-control form-control-lg bg-transparent text-bg-dark ${errorsCartToAccount.cartToAccount && 'is-invalid'}`}
                                                placeholder={'شماره حساب را وارد کنید '}/>
                                        {
                                            errorsCartToAccount.cartToAccount && errorsCartToAccount.cartToAccount.type === 'required' && (
                                                <p className='text-danger small fw-bold mt-1'>
                                                    {errorsCartToAccount.cartToAccount?.message}
                                                </p>
                                            )
                                        }{
                                        errorsCartToAccount.cartToAccount && (errorsCartToAccount.cartToAccount.type === 'minLength' || errorsCartToAccount.cartToAccount.type === 'maxLength') &&
                                        (
                                            <p className='text-danger small fw-bold mt-1'>
                                                شماره کارت صحیح نیست
                                            </p>
                                        )
                                    }{
                                        errorsCartToAccount.cartToAccount && errorsCartToAccount.cartToAccount.type === 'validate' && (
                                            <p className='text-danger small fw-bold mt-1'>
                                                {errorsCartToAccount.cartToAccount?.message}
                                            </p>
                                        )
                                    }
                                        <DevelopingMode/>
                                        <div className='text-center mt-4'>
                                            <ReactiveButton
                                                shadow
                                                rounded
                                                buttonState={cartToAccount}
                                                idleText="دریافت شماره شبا"
                                                loadingText="در حال تبدیل ..."
                                                successText="عملیات با موفقیت انجام شد"
                                                errorText="عملیات ناموفق !"
                                                onClick={() => cartToAccountConvert('cartToAccount')}
                                                type='submit'
                                            />
                                        </div>
                                    </div>
                                }
                            />
                        )
                    ))}
                </Carousel>
            </div>
        </>
    )
}
export default MainPage;