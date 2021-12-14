import styles from '../styles/FilterOption.module.css'

export default function FilterOption({value,name,checked,onChange}){
    return (
        <label className={styles.label}>
            <input type='checkbox'
            className={styles.inputOption}
            value={value}
            name={name}
            checked={checked}
            onChange={onChange}
            />
            {value}
    </label>
    )
}