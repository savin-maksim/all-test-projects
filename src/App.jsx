import React, { useState } from 'react'
import {
	TextField,
	Autocomplete,
	Button,
	Chip,
	Typography,
} from '@mui/material'

import { recipes, allIngredients } from './data'

function App() {
	const [selectedOptions, setSelectedOptions] = useState([])
	const [suggestedRecipe, setSuggestedRecipe] = useState(null)
	const handleChange = (event, newValue) => {
		setSelectedOptions(newValue)
	}

	const handleDelete = valueToDelete => {
		setSelectedOptions(prevOptions =>
			prevOptions.filter(value => value !== valueToDelete)
		)
	}

	const handleSuggestRecipe = async () => {
		try {
			const formData = new FormData()
			selectedOptions.forEach(ingredient =>
				formData.append('ingredients', ingredient)
			)

			const response = await fetch(
				'https://recipe-386b0335b029.herokuapp.com/suggestRecipe',
				{
					method: 'POST',
					body: formData,
				}
			)

			if (response.ok) {
				const data = await response.json()
				setSuggestedRecipe({
					name: data.name,
					ingredients: data.ingredients,
					imageUrl: data.imageUrl,
					prepTime: data.cookingTime,
				})
			} else {
				setSuggestedRecipe(null)
			}
		} catch (error) {
			console.error('Error fetching suggested recipe:', error)
			setSuggestedRecipe(null)
		}
	}

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				backgroundColor: '#ADD8E6',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					marginRight: '20px',
					backgroundColor: '#E0F2F1',
				}}
			>
				<Autocomplete
					multiple
					options={allIngredients}
					style={{ width: 300 }}
					onChange={handleChange}
					renderTags={() => null}
					renderInput={params => (
						<TextField
							{...params}
							label='Select Ingredient'
							variant='outlined'
						/>
					)}
				/>
				<Button variant='contained' onClick={handleSuggestRecipe}>
					Suggest a recipe
				</Button>
			</div>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					backgroundColor: '#E0F2F1',
					height: '300px',
					width: '200px',
				}}
			>
				{selectedOptions.map(option => (
					<Chip
						key={option}
						label={option}
						color='primary'
						onDelete={() => handleDelete(option)}
						style={{ margin: '5px' }}
					/>
				))}
			</div>

			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					backgroundColor: '#E0F2F1',
					height: '300px',
					width: '200px',
				}}
			>
				{suggestedRecipe && (
					<div style={{ marginTop: '10px' }}>
						<Typography variant='h6'>{suggestedRecipe.name}</Typography>
						{suggestedRecipe.imageUrl && (
							<img
								src={suggestedRecipe.imageUrl}
								alt={suggestedRecipe.name}
								style={{ maxWidth: '150px', maxHeight: '100px' }}
							/>
						)}
						<Typography variant='body2'>
							Prep Time: {suggestedRecipe.prepTime} minutes
						</Typography>
					</div>
				)}
			</div>
		</div>
	)
}

export default App