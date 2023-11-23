import { FormPath } from '@/@formily/shared'
import { Form } from '../models'

const createForm = (options) => {
    return new Form(options)
}

export {
    FormPath,
    createForm
}