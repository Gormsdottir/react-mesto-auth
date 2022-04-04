
function InfoToolTip({ name, isOpen, onClose, toolTipMessage }) {


    return (
        <div
            className={isOpen
                ? `popup popup_type_${name} popup_opened`
                : `popup popup_type_${name}`}
        >
            <div className="popup__container">
                <img className="popup__tooltip-img"
                    alt={toolTipMessage.message}
                    src={toolTipMessage.img}
                ></img>
                <button
                    className="button button_type_close"
                    type="button"
                    onClick={onClose}
                ></button>
                <h2
                    className="popup__title"
                >
                    {toolTipMessage.message}
                </h2>
            </div>
        </div>
    );
}

export default InfoToolTip;