import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <>
    <Link href='/products'>
    <h1>Go to products!</h1>
    </Link>
    </>
  )
}
