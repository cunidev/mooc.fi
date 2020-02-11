import React, { useContext } from "react"
import { CourseVariantFormValues } from "/components/Dashboard/Editor/Course/types"
import { Field, FieldArray, FormikErrors, getIn } from "formik"
import { Grid } from "@material-ui/core"
import { initialVariant } from "./form-validation"
import AddIcon from "@material-ui/icons/Add"
import RemoveIcon from "@material-ui/icons/Remove"
import {
  OutlinedFormControl,
  OutlinedInputLabel,
  OutlinedFormGroup,
  StyledTextField,
} from "/components/Dashboard/Editor/common"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import styled from "styled-components"
import getCoursesTranslator from "/translations/courses"
import LanguageContext from "/contexes/LanguageContext"
import { useConfirm } from "material-ui-confirm"

const ButtonWithWhiteText = styled(StyledButton)`
  color: white;
`

const CourseVariantEditForm = ({
  values,
  errors,
  isSubmitting,
}: {
  values: CourseVariantFormValues[]
  errors?: (FormikErrors<CourseVariantFormValues> | undefined)[]
  isSubmitting: boolean
}) => {
  const { language } = useContext(LanguageContext)
  const t = getCoursesTranslator(language)
  const confirm = useConfirm()

  return (
    <section>
      <Grid item xs={12}>
        <OutlinedFormControl>
          <OutlinedInputLabel shrink>{t("courseVariants")}</OutlinedInputLabel>
          <OutlinedFormGroup>
            <FieldArray
              name="course_variants"
              render={helpers => (
                <>
                  {values!.length
                    ? values!.map((variant, index: number) => (
                        <Grid container spacing={2} key={`variant-${index}`}>
                          <Grid item xs={4}>
                            <Field
                              name={`course_variants[${index}].slug`}
                              label={t("courseSlug")}
                              type="text"
                              component={StyledTextField}
                              value={variant.slug}
                              errors={[getIn(errors, `[${index}].slug`)]}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Field
                              name={`course_variants[${index}].description`}
                              label={t("courseDescription")}
                              type="text"
                              component={StyledTextField}
                              value={variant.description}
                              errors={[getIn(errors, `[${index}].description`)]}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <Grid
                              container
                              justify="flex-end"
                              alignItems="center"
                            >
                              <StyledButton
                                variant="contained"
                                disabled={isSubmitting}
                                color="secondary"
                                onClick={() => {
                                  if (!variant.id && variant.slug === "") {
                                    helpers.remove(index)
                                  } else {
                                    confirm({
                                      title: t("confirmationAreYouSure"),
                                      description: t(
                                        "confirmationRemoveVariant",
                                      ),
                                      confirmationText: t("confirmationYes"),
                                      cancellationText: t("confirmationNo"),
                                    }).then(() => helpers.remove(index))
                                  }
                                }}
                                endIcon={
                                  <RemoveIcon>{t("courseRemove")}</RemoveIcon>
                                }
                              >
                                {t("courseRemove")}
                              </StyledButton>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))
                    : t("courseNoVariants")}
                  {(values!.length == 0 ||
                    (values!.length &&
                      values![values!.length - 1].slug !== "")) && (
                    <Grid container justify="flex-end">
                      <ButtonWithWhiteText
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        onClick={() => helpers.push({ ...initialVariant })}
                        endIcon={<AddIcon>{t("courseAdd")}</AddIcon>}
                      >
                        {t("courseAdd")}
                      </ButtonWithWhiteText>
                    </Grid>
                  )}
                </>
              )}
            />
          </OutlinedFormGroup>
        </OutlinedFormControl>
      </Grid>
    </section>
  )
}

export default CourseVariantEditForm
