Add-Type -AssemblyName System.Drawing

function Create-PwaIcon {
    param(
        [string]$outputPath,
        [int]$size,
        [bool]$maskable = $false
    )
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bitmap)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Background color: #0D1C16 (Deep Imperial Forest Green)
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 13, 28, 22))
    $g.FillRectangle($bgBrush, 0, 0, $size, $size)
    $bgBrush.Dispose()

    # Outer decorative gold rings
    $penGold1 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, 212, 175, 55), [Math]::Max(2, $size * 0.02))
    $penGold2 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 184, 138, 56), [Math]::Max(1, $size * 0.01))
    
    $inset1 = if ($maskable) { $size * 0.12 } else { $size * 0.05 }
    $inset2 = if ($maskable) { $size * 0.16 } else { $size * 0.09 }

    $g.DrawEllipse($penGold1, [float]$inset1, [float]$inset1, [float]($size - 2 * $inset1), [float]($size - 2 * $inset1))
    $g.DrawEllipse($penGold2, [float]$inset2, [float]$inset2, [float]($size - 2 * $inset2), [float]($size - 2 * $inset2))

    $penGold1.Dispose()
    $penGold2.Dispose()

    # Draw Royal 'V' Monogram / Crest
    $fontSize = [int]($size * 0.42)
    $fontFamily = New-Object System.Drawing.FontFamily("Times New Roman")
    $font = New-Object System.Drawing.Font($fontFamily, $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center

    # Gold gradient brush for letter V
    $rect = New-Object System.Drawing.RectangleF(0, ($size * 0.02), $size, ($size * 0.75))
    $goldBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $rect,
        [System.Drawing.Color]::FromArgb(255, 243, 229, 171),
        [System.Drawing.Color]::FromArgb(255, 184, 138, 56),
        [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
    )

    $g.DrawString("V", $font, $goldBrush, $rect, $format)

    # Subtitle 'VIETTORIA'
    $subFontSize = [int]($size * 0.085)
    $subFont = New-Object System.Drawing.Font($fontFamily, $subFontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $subRect = New-Object System.Drawing.RectangleF(0, ($size * 0.68), $size, ($size * 0.2))
    $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 212, 175, 55))
    $g.DrawString("VIETTORIA", $subFont, $subBrush, $subRect, $format)

    $g.Dispose()
    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bitmap.Dispose()
    Write-Host "Created $outputPath ($size x $size)"
}

Create-PwaIcon -outputPath "viettoria-FE/public/pwa-192x192.png" -size 192 -maskable $false
Create-PwaIcon -outputPath "viettoria-FE/public/pwa-512x512.png" -size 512 -maskable $false
Create-PwaIcon -outputPath "viettoria-FE/public/apple-touch-icon.png" -size 180 -maskable $false
Create-PwaIcon -outputPath "viettoria-FE/public/maskable-icon-512x512.png" -size 512 -maskable $true
