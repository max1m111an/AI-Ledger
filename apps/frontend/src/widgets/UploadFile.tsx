import React, {
    useState, useEffect, useCallback, useMemo,
} from "react";
import { paychecksApi } from "@/api/PaychecksApi.ts";

export function UploadFile() {
    const [ dragActive, setDragActive ] = useState(false);
    const [ file, setFile ] = useState<File | null>(null);
    const [ uploading, setUploading ] = useState(false);
    const [ progress, setProgress ] = useState<number>(0);
    const [ error, setError ] = useState<string | null>(null);
    const [ showSuccess, setShowSuccess ] = useState(false);
    const [ uploadResult, setUploadResult ] = useState<any>(null);

    const allowedTypes = useMemo(() => [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
    ], []);

    const handleFile = useCallback((file: File) => {
        if (!allowedTypes.includes(file.type)) {
            setError("Неверный тип файла. Допустимы: png, jpeg, webp, gif, bmp");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Файл слишком большой. Максимальный размер: 5MB");
            return;
        }
        setFile(file);
        setError(null);
        setProgress(0);
        setShowSuccess(false);
    }, [ allowedTypes ]);

    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
                const pastedFile = e.clipboardData.files[0];
                handleFile(pastedFile);
            }
        };

        document.addEventListener("paste", handlePaste);
        return () => document.removeEventListener("paste", handlePaste);
    }, [ handleFile ]);

    const handleUpload = async() => {
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            const result = await paychecksApi.uploadPaycheckPhoto(file);

            clearInterval(progressInterval);
            setProgress(100);

            setUploadResult(result.paycheck);
            setTimeout(() => {
                setShowSuccess(true);
                setUploading(false);
            }, 500);

        } catch (err: any) {
            setError(`Ошибка при загрузке: ${err.response?.data?.message || err.message || "Неизвестная ошибка"}`);
            setUploading(false);
        }
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleReset = () => {
        setFile(null);
        setProgress(0);
        setError(null);
        setUploading(false);
        setShowSuccess(false);
        setUploadResult(null);
    };

    const handleNewUpload = () => {
        setShowSuccess(false);
        setFile(null);
        setProgress(0);
        setError(null);
        setUploading(false);
        setUploadResult(null);
    };

    const formatCategory = (category: string) => {
        const categories: Record<string, string> = {
            "Cafe": "Кафе",
            "Transport": "Транспорт",
            "Transfer": "Перевод",
            "Utilities": "Коммуналка",
            "Healthcare": "Здоровье",
            "Marketplace": "Маркетплейс",
            "Entertainment": "Развлечения",
            "Shop": "Магазин",
            "Other": "Другое",
        };
        return categories[category] || category;
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    };

    if (showSuccess && uploadResult) {
        return (
            <>
                <span className="title">Чек успешно загружен!</span>
                <span className="addition_3 mb-20">
                    Операция добавлена в ваш журнал
                </span>

                <div className="success-result">
                    <div className="success-icon">✓</div>

                    <div className="result-details">
                        <div className="detail-row">
                            <span className="addition_2">Название:</span>
                            <span className="addition_1">{uploadResult.name}</span>
                        </div>
                        <div className="detail-row">
                            <span className="addition_2">Категория:</span>
                            <span className="addition_1">{formatCategory(uploadResult.category)}</span>
                        </div>
                        <div className="detail-row">
                            <span className="addition_2">Дата:</span>
                            <span className="addition_1">{formatDate(uploadResult.pay_date)}</span>
                        </div>
                        <div className="detail-row">
                            <span className="addition_2">Сумма:</span>
                            <span className="addition_1 positive">{uploadResult.price} ₽</span>
                        </div>
                    </div>

                    <div className="success-actions">
                        <button
                            onClick={handleNewUpload}
                            className="Button new-upload"
                        >
                            Загрузить еще
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <span className="title">Загрузка чека</span>
            <span className="addition_3 mb-20">
                Загрузите фото, проверьте распознавание и сохраните операцию
            </span>
            <div
                className={ `upload-dropzone ${dragActive ? "active" : ""}` }
                onDragEnter={ handleDrag }
                onDragOver={ handleDrag }
                onDragLeave={ handleDrag }
                onDrop={ handleDrop }
            >
                {file ? (
                    <div className="file-info">
                        <span className="addition_2">
                            Выбран файл: <strong>{file.name}</strong>
                        </span>

                        {uploading && (
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${progress}%` }}
                                />
                                <span className="progress-text">{progress}%</span>
                            </div>
                        )}

                        <div className="actions">
                            {!uploading ? (
                                <>
                                    <button
                                        onClick={ handleUpload }
                                        className="control_btn accept"
                                        disabled={uploading}
                                    >
                                        Отправить
                                    </button>
                                    <button
                                        onClick={ handleReset }
                                        className="control_btn cancel"
                                        disabled={uploading}
                                    >
                                        Сбросить
                                    </button>
                                </>
                            ) : (
                                <span className="addition_2">Загрузка...</span>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <svg className="icon upload">
                            <use href="#UploadingReceipts" />
                        </svg>
                        <span className="addition_1">
                            Перетащите сюда изображение или нажмите для выбора
                        </span>
                        <span className="addition_3">
                            Поддерживаются фото и скриншоты (до 5MB)
                        </span>

                        <label className="Button uploadReceipt w-a">
                            Загрузить
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.gif,.webp,.bmp"
                                onChange={ handleChange }
                                hidden
                            />
                        </label>
                    </>
                )}
                {error && <div className="error-message"><span className="addition_2">{error}</span></div>}
            </div>
        </>
    );
}
