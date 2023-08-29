import toolState from "../store/toolState";

export const SettingBar = () => {
    return (
        <div className='toolbar'>

            <label>
                Толщина линии
                <input
                    onChange={e => toolState.setLineWidth(e.target.value)}
                    type="number"
                    min={1}
                    max={50}
                    defaultValue={1}/>
            </label>

            <label>
                Цвет обводки
                <input
                    onChange={e => toolState.setStrokeColor(e.target.value)}
                    type="color"
                />
            </label>

        </div>
    )
}
